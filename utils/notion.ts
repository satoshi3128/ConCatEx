/**
 * Notion API Integration for Contact Form
 * お問い合わせデータをNotionデータベースに保存
 */

import { Client } from '@notionhq/client';
import Logger from './loggerSimple';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface NotionSaveResult {
  success: boolean;
  notionId?: string;
  error?: string;
}

/**
 * Notion API クライアントの初期化
 */
function getNotionClient(): Client | null {
  const apiKey = process.env.NOTION_API_KEY;
  
  if (!apiKey) {
    Logger.error('contact', 'Notion API key not configured', {
      env: process.env.NODE_ENV
    });
    return null;
  }

  return new Client({
    auth: apiKey,
  });
}

/**
 * 環境変数の検証
 */
function validateNotionConfig(): { isValid: boolean; error?: string } {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey) {
    return { isValid: false, error: 'NOTION_API_KEY is not configured' };
  }

  if (!databaseId) {
    return { isValid: false, error: 'NOTION_DATABASE_ID is not configured' };
  }

  return { isValid: true };
}

/**
 * お問い合わせデータをNotionに保存
 */
export async function saveToNotion(
  data: ContactFormData, 
  spamScore: number,
  request?: Request
): Promise<NotionSaveResult> {
  try {
    // 設定検証
    const configCheck = validateNotionConfig();
    if (!configCheck.isValid) {
      Logger.error('contact', 'Notion configuration invalid', {
        error: configCheck.error
      }, request);
      return { success: false, error: configCheck.error };
    }

    // Notionクライアント初期化
    const notion = getNotionClient();
    if (!notion) {
      return { success: false, error: 'Failed to initialize Notion client' };
    }

    const databaseId = process.env.NOTION_DATABASE_ID!;

    Logger.info('contact', 'Saving data to Notion', {
      databaseId: databaseId.substring(0, 8) + '...',
      spamScore,
      hasName: !!data.name,
      hasEmail: !!data.email,
      hasMessage: !!data.message,
      messageLength: data.message.length
    }, request);

    // Notionページ作成
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        '名前': {
          title: [
            {
              text: {
                content: data.name.trim(),
              },
            },
          ],
        },
        'メールアドレス': {
          email: data.email.trim(),
        },
        'メッセージ': {
          rich_text: [
            {
              text: {
                content: data.message.trim(),
              },
            },
          ],
        },
        'スパムスコア': {
          number: spamScore,
        },
        'ステータス': {
          select: {
            name: '未対応',
          },
        },
        '送信日時': {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    Logger.info('contact', 'Successfully saved to Notion', {
      notionId: response.id,
      spamScore
    }, request);

    return {
      success: true,
      notionId: response.id,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    Logger.error('contact', 'Failed to save to Notion', {
      error: errorMessage,
      spamScore,
      dataKeys: Object.keys(data)
    }, request);

    return {
      success: false,
      error: `Notion save failed: ${errorMessage}`,
    };
  }
}

/**
 * Notion接続テスト
 */
export async function testNotionConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const configCheck = validateNotionConfig();
    if (!configCheck.isValid) {
      return { success: false, error: configCheck.error };
    }

    const notion = getNotionClient();
    if (!notion) {
      return { success: false, error: 'Failed to initialize Notion client' };
    }

    const databaseId = process.env.NOTION_DATABASE_ID!;

    // データベース情報を取得してテスト
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });

    Logger.info('contact', 'Notion connection test successful', {
      databaseTitle: 'Connected',
      databaseId: databaseId.substring(0, 8) + '...'
    });

    return { success: true };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    Logger.error('contact', 'Notion connection test failed', {
      error: errorMessage
    });

    return { success: false, error: errorMessage };
  }
}