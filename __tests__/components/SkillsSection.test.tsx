import { render, screen, fireEvent } from '@testing-library/react';
import SkillsSection from '@/components/SkillsSection';

const mockSkillsData = {
  overview: 'テストの概要説明です。',
  categories: [
    {
      name: 'プログラミング言語',
      icon: '💻',
      items: [
        {
          name: 'TypeScript',
          experience: '約3年',
          notes: 'テストプロジェクト'
        },
        {
          name: 'JavaScript',
          experience: '約5年',
          notes: 'Webアプリ開発'
        }
      ]
    },
    {
      name: 'フレームワーク',
      icon: '🏗️',
      items: [
        {
          name: 'React',
          experience: '約2年',
          notes: 'SPA開発'
        }
      ]
    }
  ]
};

describe('SkillsSection', () => {
  test('概要説明が表示される', () => {
    render(<SkillsSection skillsData={mockSkillsData} />);
    expect(screen.getByText('テストの概要説明です。')).toBeInTheDocument();
  });

  test('全カテゴリが初期状態で閉じられている', () => {
    render(<SkillsSection skillsData={mockSkillsData} />);
    
    // カテゴリヘッダーは表示される
    expect(screen.getByText('プログラミング言語')).toBeInTheDocument();
    expect(screen.getByText('フレームワーク')).toBeInTheDocument();
    
    // 詳細テーブルは非表示
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  test('カテゴリをクリックするとアコーディオンが展開される', () => {
    render(<SkillsSection skillsData={mockSkillsData} />);
    
    const programmingButton = screen.getByRole('button', { name: /プログラミング言語/ });
    fireEvent.click(programmingButton);
    
    // 展開後はスキル詳細が表示される
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('約3年')).toBeInTheDocument();
    expect(screen.getByText('テストプロジェクト')).toBeInTheDocument();
  });

  test('展開されたカテゴリを再クリックすると閉じられる', () => {
    render(<SkillsSection skillsData={mockSkillsData} />);
    
    const programmingButton = screen.getByRole('button', { name: /プログラミング言語/ });
    
    // 展開
    fireEvent.click(programmingButton);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    
    // 再クリックで閉じる
    fireEvent.click(programmingButton);
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
  });

  test('複数のカテゴリを同時に展開できる', () => {
    render(<SkillsSection skillsData={mockSkillsData} />);
    
    const programmingButton = screen.getByRole('button', { name: /プログラミング言語/ });
    const frameworkButton = screen.getByRole('button', { name: /フレームワーク/ });
    
    // 両方展開
    fireEvent.click(programmingButton);
    fireEvent.click(frameworkButton);
    
    // 両方のカテゴリの内容が表示される
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  test('項目数が正しく表示される', () => {
    render(<SkillsSection skillsData={mockSkillsData} />);
    
    expect(screen.getByText('2項目')).toBeInTheDocument(); // プログラミング言語
    expect(screen.getByText('1項目')).toBeInTheDocument(); // フレームワーク
  });

  test('アイコンが表示される', () => {
    render(<SkillsSection skillsData={mockSkillsData} />);
    
    expect(screen.getByText('💻')).toBeInTheDocument();
    expect(screen.getByText('🏗️')).toBeInTheDocument();
  });

  test('アコーディオンボタンのaria属性が正しく設定される', () => {
    render(<SkillsSection skillsData={mockSkillsData} />);
    
    const programmingButton = screen.getByRole('button', { name: /プログラミング言語/ });
    
    // 初期状態：閉じている
    expect(programmingButton).toHaveAttribute('aria-expanded', 'false');
    
    // クリック後：開いている
    fireEvent.click(programmingButton);
    expect(programmingButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('テーブルヘッダーが正しく表示される', () => {
    render(<SkillsSection skillsData={mockSkillsData} />);
    
    const programmingButton = screen.getByRole('button', { name: /プログラミング言語/ });
    fireEvent.click(programmingButton);
    
    expect(screen.getAllByText('技術・スキル')).toHaveLength(1);
    expect(screen.getByText('実経験期間')).toBeInTheDocument();
    expect(screen.getByText('備考・代表案件例')).toBeInTheDocument();
  });

  test('ホバーテキストが状態に応じて変化する', () => {
    render(<SkillsSection skillsData={mockSkillsData} />);
    
    const programmingButton = screen.getByRole('button', { name: /プログラミング言語/ });
    
    // 初期状態：「詳細を見る」が複数存在する可能性があるため、最初の要素をチェック
    expect(screen.getAllByText('詳細を見る')).toHaveLength(2); // 2つのカテゴリ分
    
    // 展開後：「閉じる」が1つ、「詳細を見る」が1つ
    fireEvent.click(programmingButton);
    expect(screen.getByText('閉じる')).toBeInTheDocument();
    expect(screen.getAllByText('詳細を見る')).toHaveLength(1); // 残り1つのカテゴリ分
  });
});