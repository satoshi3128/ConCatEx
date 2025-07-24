import { expect, test, describe } from 'vitest';
import { markdownToHtml } from '@/utils/markdown';

describe('markdownToHtml', () => {
  test('converts basic markdown to HTML', async () => {
    const markdown = '# Heading\n\nThis is a paragraph.';
    const html = await markdownToHtml(markdown);

    expect(html).toContain('<h1>Heading</h1>');
    expect(html).toContain('<p>This is a paragraph.</p>');
  });

  test('converts markdown lists to HTML', async () => {
    const markdown = '- Item 1\n- Item 2\n- Item 3';
    const html = await markdownToHtml(markdown);

    expect(html).toContain('<ul>');
    expect(html).toContain('<li>Item 1</li>');
    expect(html).toContain('<li>Item 2</li>');
    expect(html).toContain('<li>Item 3</li>');
    expect(html).toContain('</ul>');
  });

  test('converts markdown links to HTML', async () => {
    const markdown = '[Google](https://google.com)';
    const html = await markdownToHtml(markdown);

    expect(html).toContain('<a href="https://google.com">Google</a>');
  });

  test('converts markdown bold and italic to HTML', async () => {
    const markdown = '**Bold text** and *italic text*';
    const html = await markdownToHtml(markdown);

    expect(html).toContain('<strong>Bold text</strong>');
    expect(html).toContain('<em>italic text</em>');
  });

  test('converts markdown code blocks to HTML', async () => {
    const markdown = '```javascript\nconst x = 1;\n```';
    const html = await markdownToHtml(markdown);

    expect(html).toContain('<pre>');
    expect(html).toContain('</code>');
    expect(html).toContain('const x = 1;');
  });

  test('converts inline code to HTML', async () => {
    const markdown = 'This is `inline code` example.';
    const html = await markdownToHtml(markdown);

    expect(html).toContain('<code>inline code</code>');
  });

  test('handles multiple heading levels', async () => {
    const markdown = '# H1\n## H2\n### H3';
    const html = await markdownToHtml(markdown);

    expect(html).toContain('<h1>H1</h1>');
    expect(html).toContain('<h2>H2</h2>');
    expect(html).toContain('<h3>H3</h3>');
  });

  test('handles empty markdown', async () => {
    const markdown = '';
    const html = await markdownToHtml(markdown);

    expect(html).toBe('');
  });

  test('handles markdown with line breaks', async () => {
    const markdown = 'Line 1\n\nLine 2\n\nLine 3';
    const html = await markdownToHtml(markdown);

    expect(html).toContain('<p>Line 1</p>');
    expect(html).toContain('<p>Line 2</p>');
    expect(html).toContain('<p>Line 3</p>');
  });

  test('handles ordered lists', async () => {
    const markdown = '1. First item\n2. Second item\n3. Third item';
    const html = await markdownToHtml(markdown);

    expect(html).toContain('<ol>');
    expect(html).toContain('<li>First item</li>');
    expect(html).toContain('<li>Second item</li>');
    expect(html).toContain('<li>Third item</li>');
    expect(html).toContain('</ol>');
  });

  test('handles blockquotes', async () => {
    const markdown = '> This is a blockquote';
    const html = await markdownToHtml(markdown);

    expect(html).toContain('<blockquote>');
    expect(html).toContain('<p>This is a blockquote</p>');
    expect(html).toContain('</blockquote>');
  });

  test('handles complex markdown with multiple elements', async () => {
    const markdown = `# Skills & Tech Stacks

## Programming Languages
- **TypeScript**: 熟練。大規模なフロントエンド・バックエンド開発での利用経験多数。
- **Python**: 実務経験。データ処理、バッチ、API開発で使用。

### その他
[GitHub](https://github.com)でのリポジトリ管理。`;

    const html = await markdownToHtml(markdown);

    expect(html).toContain('<h1>Skills &#x26; Tech Stacks</h1>');
    expect(html).toContain('<h2>Programming Languages</h2>');
    expect(html).toContain('<h3>その他</h3>');
    expect(html).toContain('<strong>TypeScript</strong>');
    expect(html).toContain('<strong>Python</strong>');
    expect(html).toContain('<a href="https://github.com">GitHub</a>');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>');
  });
});
