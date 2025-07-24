/**
 * Edge Runtime Compatible Logger
 * Vercel Edge Runtime対応の軽量ログシステム
 */

// ログレベル定義
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

// ログカテゴリ定義
export type LogCategory = 'access' | 'contact' | 'error' | 'performance';

// ログエントリ型定義
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  metadata?: Record<string, any>;
  sessionId: string;
  userAgent?: string;
  anonymizedIP?: string;
}

// 環境設定
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * 簡単なハッシュ化（Edge Runtime対応）
 */
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit整数に変換
  }
  return Math.abs(hash).toString(16).substring(0, 16);
}

/**
 * IPアドレス匿名化（Edge Runtime対応）
 */
function anonymizeIP(ip: string): string {
  const salt = process.env.IP_HASH_SALT || 'concat_default_salt_2025';
  return simpleHash(ip + salt);
}

/**
 * セッションID生成（Edge Runtime対応）
 */
function generateSessionId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 15);
  return simpleHash(timestamp + random);
}

/**
 * クライアントIPアドレス取得
 */
function getClientIP(request?: Request): string | undefined {
  if (typeof window !== 'undefined') {
    // クライアントサイドでは取得不可
    return undefined;
  }

  if (!request) return undefined;

  // Vercel環境でのIP取得
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (cfConnectingIP) return cfConnectingIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;

  return undefined;
}

/**
 * ログ出力（Edge Runtime対応）
 */
function outputLog(entry: LogEntry): void {
  try {
    if (isDevelopment) {
      // 開発環境では見やすく出力
      const prefix = `[${entry.level.toUpperCase()}][${entry.category}]`;
      const timestamp = new Date(entry.timestamp).toLocaleTimeString();
      console.log(`${prefix} ${timestamp} ${entry.message}`, entry.metadata || '');
    } else if (isProduction) {
      // 本番環境ではJSON形式で出力
      console.log(JSON.stringify(entry));
    }
  } catch (error) {
    // ログ出力でエラーが発生した場合、フォールバック
    console.error('Logger output error:', error);
    console.log(`[${entry.level}] ${entry.message}`);
  }
}

/**
 * メインLoggerクラス（Edge Runtime対応）
 */
class SimpleLogger {
  private static sessionId: string | null = null;

  /**
   * セッションIDの初期化
   */
  private static ensureSessionId(): string {
    if (!this.sessionId) {
      this.sessionId = generateSessionId();
    }
    return this.sessionId;
  }

  /**
   * 基本ログ出力
   */
  private static log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    metadata?: Record<string, any>,
    request?: Request
  ): void {
    try {
      const clientIP = getClientIP(request);
      const sessionId = this.ensureSessionId();
      
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        category,
        message,
        sessionId,
        ...(metadata && { metadata }),
        ...(request && { userAgent: request.headers.get('user-agent') || undefined }),
        ...(clientIP && { anonymizedIP: anonymizeIP(clientIP) })
      };

      outputLog(logEntry);
    } catch (error) {
      // ログ処理でエラーが発生した場合のフォールバック
      console.error('Logger error:', error);
      console.log(`[${level}][${category}] ${message}`);
    }
  }

  /**
   * 情報ログ
   */
  static info(category: LogCategory, message: string, metadata?: Record<string, any>, request?: Request): void {
    this.log(LogLevel.INFO, category, message, metadata, request);
  }

  /**
   * 警告ログ
   */
  static warn(category: LogCategory, message: string, metadata?: Record<string, any>, request?: Request): void {
    this.log(LogLevel.WARN, category, message, metadata, request);
  }

  /**
   * エラーログ
   */
  static error(category: LogCategory, message: string, metadata?: Record<string, any>, request?: Request): void {
    this.log(LogLevel.ERROR, category, message, metadata, request);
  }

  /**
   * デバッグログ（開発環境のみ）
   */
  static debug(category: LogCategory, message: string, metadata?: Record<string, any>, request?: Request): void {
    if (isDevelopment) {
      this.log(LogLevel.DEBUG, category, message, metadata, request);
    }
  }

  /**
   * アクセスログ（専用メソッド）
   */
  static access(path: string, method: string, statusCode: number, responseTime: number, request?: Request): void {
    this.info('access', `${method} ${path}`, {
      method,
      path,
      statusCode,
      responseTime,
      timestamp: new Date().toISOString()
    }, request);
  }

  /**
   * お問い合わせログ（専用メソッド）
   */
  static contact(action: string, success: boolean, metadata?: Record<string, any>, request?: Request): void {
    const level = success ? LogLevel.INFO : LogLevel.WARN;
    this.log(level, 'contact', `Contact form: ${action}`, {
      action,
      success,
      timestamp: new Date().toISOString(),
      ...metadata
    }, request);
  }

  /**
   * パフォーマンスログ（専用メソッド）
   */
  static performance(metric: string, value: number, unit: string = 'ms', metadata?: Record<string, any>): void {
    this.info('performance', `Performance metric: ${metric}`, {
      metric,
      value,
      unit,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  }

  /**
   * 新しいセッションID生成
   */
  static newSession(): void {
    this.sessionId = null; // リセットして次回ログ時に新しいIDを生成
    this.debug('access', 'New session started', {});
  }
}

export default SimpleLogger;

/**
 * クライアントサイド用Logger（Edge Runtime対応）
 */
export class ClientLogger {
  private static sessionId: string = generateSessionId();

  /**
   * クライアントサイドでの基本ログ
   */
  private static log(level: LogLevel, category: LogCategory, message: string, metadata?: Record<string, any>): void {
    if (typeof window === 'undefined') {
      // サーバーサイドでは通常のLoggerを使用
      SimpleLogger[level === LogLevel.DEBUG ? 'debug' : level](category, message, metadata);
      return;
    }

    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        category,
        message,
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...metadata
      };

      if (isDevelopment) {
        const prefix = `[${level.toUpperCase()}][${category}]`;
        console[level === 'debug' ? 'log' : level](`${prefix} ${message}`, logEntry);
      }

      // 本番環境では必要に応じてAPIエンドポイントに送信
      // if (isProduction && level !== 'debug') {
      //   fetch('/api/log', { method: 'POST', body: JSON.stringify(logEntry) });
      // }
    } catch (error) {
      console.error('Client logger error:', error);
      console.log(`[${level}][${category}] ${message}`);
    }
  }

  static info(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, category, message, metadata);
  }

  static warn(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, category, message, metadata);
  }

  static error(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, category, message, metadata);
  }

  static debug(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, category, message, metadata);
  }

  static newSession(): void {
    this.sessionId = generateSessionId();
    this.debug('access', 'New client session started', { sessionId: this.sessionId });
  }
}