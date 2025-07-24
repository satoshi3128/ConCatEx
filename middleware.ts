/**
 * Next.js Middleware for Logging and Security
 * アクセスログ・パフォーマンス監視・基本セキュリティ対応
 */

import { NextRequest, NextResponse } from 'next/server';
import Logger from './utils/loggerSimple';

// 除外パス（ログ記録しない）
const EXCLUDED_PATHS = [
  '/_next/static',
  '/_next/image',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml'
];

// APIパス判定
const API_PATHS = ['/api/'];

/**
 * パスが除外対象かチェック
 */
function isExcludedPath(pathname: string): boolean {
  return EXCLUDED_PATHS.some(excluded => pathname.startsWith(excluded));
}

/**
 * APIパスかチェック
 */
function isApiPath(pathname: string): boolean {
  return API_PATHS.some(api => pathname.startsWith(api));
}

/**
 * レスポンス時間計測
 */
function measureResponseTime(startTime: number): number {
  return Date.now() - startTime;
}

/**
 * リクエスト情報の安全な取得
 */
function getRequestInfo(request: NextRequest) {
  return {
    method: request.method,
    url: request.url,
    pathname: request.nextUrl.pathname,
    userAgent: request.headers.get('user-agent') || 'unknown',
    referer: request.headers.get('referer') || undefined,
    origin: request.headers.get('origin') || undefined
  };
}

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { method, pathname } = getRequestInfo(request);

  // 除外パスはログ記録せずそのまま通す
  if (isExcludedPath(pathname)) {
    return NextResponse.next();
  }

  // レスポンス処理
  const response = NextResponse.next();

  // レスポンス後の処理（非同期）
  Promise.resolve().then(() => {
    const responseTime = measureResponseTime(startTime);
    const statusCode = response.status;

    try {
      // アクセスログ記録
      Logger.access(pathname, method, statusCode, responseTime, request);

      // APIエラーの詳細ログ
      if (isApiPath(pathname) && statusCode >= 400) {
        Logger.error('access', `API Error: ${method} ${pathname}`, {
          statusCode,
          responseTime,
          method,
          pathname
        }, request);
      }

      // パフォーマンス監視
      if (responseTime > 3000) {
        Logger.warn('performance', `Slow response detected: ${pathname}`, {
          responseTime,
          method,
          pathname,
          threshold: 3000
        });
      }

      // 異常なステータスコードの監視
      if (statusCode >= 500) {
        Logger.error('error', `Server error: ${statusCode}`, {
          statusCode,
          method,
          pathname,
          responseTime
        }, request);
      }

    } catch (error) {
      // ログ処理自体でエラーが発生した場合の緊急ログ
      console.error('[Middleware] Logging error:', error);
    }
  });

  // セキュリティヘッダーの追加
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// ミドルウェア適用範囲の設定
export const config = {
  matcher: [
    /*
     * 以下を除く全てのパスにマッチ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};