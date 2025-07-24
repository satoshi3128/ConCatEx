import '@testing-library/jest-dom';

// テスト環境用の環境変数設定
process.env.NOTION_API_KEY = 'test_api_key';
process.env.NOTION_DATABASE_ID = 'test_database_id';
process.env.IP_HASH_SALT = 'test_salt';
