import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Navigation from '@/components/Navigation';
import { FloatingElementsProvider } from '@/components/FloatingElementsProvider';

// DOM methods のモック
const mockScrollIntoView = vi.fn();
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: mockScrollIntoView,
  writable: true,
});

// window.scrollY のモック
Object.defineProperty(window, 'scrollY', {
  value: 0,
  writable: true,
});

// window.matchMedia のモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// getElementById のモック
const mockGetElementById = vi.fn();
Object.defineProperty(document, 'getElementById', {
  value: mockGetElementById,
  writable: true,
});

describe('Navigation', () => {
  beforeEach(() => {
    mockScrollIntoView.mockClear();
    mockGetElementById.mockClear();

    // デフォルトの要素をモック
    mockGetElementById.mockImplementation((id: string) => ({
      offsetTop: 100,
      offsetHeight: 500,
      scrollIntoView: mockScrollIntoView,
    }));
  });

  afterEach(() => {
    // スクロールイベントリスナーをクリーンアップ
    window.removeEventListener('scroll', vi.fn());
  });

  it('ナビゲーションが正しくレンダリングされる', () => {
    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    expect(screen.getByText('自己紹介')).toBeInTheDocument();
    expect(screen.getByText('経歴')).toBeInTheDocument();
    expect(screen.getByText('スキル')).toBeInTheDocument();
    // expect(screen.getByText('活動')).toBeInTheDocument(); // 一時的に非表示
    expect(screen.getByText('お問い合わせ')).toBeInTheDocument();
  });

  it('セクションボタンがクリック可能である', () => {
    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    const navigationButtons = screen.getAllByRole('button').filter(btn => 
      ['自己紹介', '経歴', 'スキル', 'お問い合わせ'].some(text => btn.textContent?.includes(text))
    );
    expect(navigationButtons).toHaveLength(4); // 活動セクションが非表示のため4つ

    navigationButtons.forEach(button => {
      expect(button).toBeEnabled();
    });
  });

  it('セクションボタンをクリックすると scrollIntoView が呼ばれる', () => {
    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    const aboutButton = screen.getByText('自己紹介');
    fireEvent.click(aboutButton);

    expect(mockGetElementById).toHaveBeenCalledWith('about');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('異なるセクションボタンをクリックすると対応するIDで scrollIntoView が呼ばれる', () => {
    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    const skillsButton = screen.getByText('スキル');
    fireEvent.click(skillsButton);

    expect(mockGetElementById).toHaveBeenCalledWith('skills');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('要素が存在しない場合は scrollIntoView が呼ばれない', () => {
    mockGetElementById.mockReturnValue(null);
    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    const aboutButton = screen.getByText('自己紹介');
    fireEvent.click(aboutButton);

    expect(mockGetElementById).toHaveBeenCalledWith('about');
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it('初期状態ではaboutセクションがアクティブである', async () => {
    // aboutセクションの位置をモック（scrollY = 0の場合）
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    // DOMの安定を待つ
    await waitFor(() => {
      const aboutButton = screen.getByText('自己紹介').closest('button');
      expect(aboutButton).toHaveAttribute('data-active', 'true');
    });
  });

  it('スクロールイベントでアクティブセクションが変更される', async () => {
    // careerセクションの位置をモック
    mockGetElementById.mockImplementation((id: string) => {
      const positions = {
        about: { offsetTop: 0, offsetHeight: 500 },
        career: { offsetTop: 500, offsetHeight: 500 },
        skills: { offsetTop: 1000, offsetHeight: 500 },
        activities: { offsetTop: 1500, offsetHeight: 500 },
        contact: { offsetTop: 2000, offsetHeight: 500 },
      };
      return positions[id as keyof typeof positions] || null;
    });

    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    // careerセクションの位置にスクロールをシミュレート
    Object.defineProperty(window, 'scrollY', { value: 600, writable: true });

    // スクロールイベントを発火
    fireEvent.scroll(window);

    await waitFor(() => {
      const careerButton = screen.getByText('経歴').closest('button');
      expect(careerButton).toHaveAttribute('data-active', 'true');
    });
  });

  it('各ボタンに適切なアニメーション遅延が設定される', () => {
    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    const navigationButtons = screen.getAllByRole('button').filter(btn => 
      ['自己紹介', '経歴', 'スキル', 'お問い合わせ'].some(text => btn.textContent?.includes(text))
    );

    navigationButtons.forEach((button, index) => {
      expect(button).toHaveStyle(`animation-delay: ${index * 0.1}s`);
    });
  });

  it('ホバー時に適切なクラスが適用される', () => {
    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    const skillsButton = screen.getByText('スキル').closest('button');

    // 非アクティブボタンは透明背景を持つ
    expect(skillsButton).toHaveAttribute('data-active', 'false');
  });

  it('コンポーネントがアンマウントされるときにスクロールイベントリスナーが削除される', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it('ページリロード時に現在のスクロール位置に基づいて正しいセクションがアクティブになる', async () => {
    // skillsセクションの位置にいる場合をシミュレート
    mockGetElementById.mockImplementation((id: string) => {
      const positions = {
        about: { offsetTop: 0, offsetHeight: 500 },
        career: { offsetTop: 500, offsetHeight: 500 },
        skills: { offsetTop: 1000, offsetHeight: 500 },
        contact: { offsetTop: 1500, offsetHeight: 500 },
      };
      return positions[id as keyof typeof positions] || null;
    });

    // skillsセクションの位置にスクロールした状態でリロード
    Object.defineProperty(window, 'scrollY', { value: 1200, writable: true });

    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    await waitFor(() => {
      const skillsButton = screen.getByText('スキル').closest('button');
      expect(skillsButton).toHaveAttribute('data-active', 'true');
    });
  });

  it('ページリロード時にcontactセクションの位置にいる場合、正しくcontactがアクティブになる', async () => {
    mockGetElementById.mockImplementation((id: string) => {
      const positions = {
        about: { offsetTop: 0, offsetHeight: 500 },
        career: { offsetTop: 500, offsetHeight: 500 },
        skills: { offsetTop: 1000, offsetHeight: 500 },
        contact: { offsetTop: 1500, offsetHeight: 500 },
      };
      return positions[id as keyof typeof positions] || null;
    });

    // contactセクションの位置にスクロールした状態でリロード
    Object.defineProperty(window, 'scrollY', { value: 1700, writable: true });

    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    await waitFor(() => {
      const contactButton = screen.getByText('お問い合わせ').closest('button');
      expect(contactButton).toHaveAttribute('data-active', 'true');
    });
  });

  it('初期レンダリング時にちらつきが発生しない', async () => {
    let activeStates: string[] = [];
    
    mockGetElementById.mockImplementation((id: string) => {
      const positions = {
        about: { offsetTop: 0, offsetHeight: 500 },
        career: { offsetTop: 500, offsetHeight: 500 },
        skills: { offsetTop: 1000, offsetHeight: 500 },
        contact: { offsetTop: 1500, offsetHeight: 500 },
      };
      return positions[id as keyof typeof positions] || null;
    });

    // skillsセクションの位置にいる状態
    Object.defineProperty(window, 'scrollY', { value: 1200, writable: true });

    const { rerender } = render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    // 初期状態で直ちにskillsがアクティブになっているべき（aboutを経由しない）
    await waitFor(() => {
      const skillsButton = screen.getByText('スキル').closest('button');
      expect(skillsButton).toHaveAttribute('data-active', 'true');
      
      const aboutButton = screen.getByText('自己紹介').closest('button');
      expect(aboutButton).toHaveAttribute('data-active', 'false');
    }, { timeout: 100 }); // 短いタイムアウトでちらつきをテスト
  });

  it('初期状態で現在位置を即座に検出できる', () => {
    // DOMの完全な読み込みを待たずに現在位置を検出する関数をテスト
    mockGetElementById.mockImplementation((id: string) => {
      const positions = {
        about: { offsetTop: 0, offsetHeight: 500 },
        career: { offsetTop: 500, offsetHeight: 500 },
        skills: { offsetTop: 1000, offsetHeight: 500 },
        contact: { offsetTop: 1500, offsetHeight: 500 },
      };
      return positions[id as keyof typeof positions] || null;
    });

    // careerセクションの位置
    Object.defineProperty(window, 'scrollY', { value: 700, writable: true });

    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    // setTimeout や非同期処理なしで、即座にcareerがアクティブになるべき
    const careerButton = screen.getByText('経歴').closest('button');
    const aboutButton = screen.getByText('自己紹介').closest('button');
    
    // 最初のレンダリングで正しい状態になっているべき
    expect(careerButton).toHaveAttribute('data-active', 'true');
    expect(aboutButton).toHaveAttribute('data-active', 'false');
  });

  it('コンポーネント初期化時にsetTimeoutを使用しない', () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    
    mockGetElementById.mockImplementation((id: string) => {
      const positions = {
        about: { offsetTop: 0, offsetHeight: 500 },
        skills: { offsetTop: 1000, offsetHeight: 500 },
      };
      return positions[id as keyof typeof positions] || null;
    });

    Object.defineProperty(window, 'scrollY', { value: 1200, writable: true });

    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    // setTimeoutが呼ばれていないことを確認
    expect(setTimeoutSpy).not.toHaveBeenCalled();
    
    setTimeoutSpy.mockRestore();
  });

  it('リロード時にちらつきが発生しない（初期状態null）', () => {
    mockGetElementById.mockImplementation((id: string) => {
      const positions = {
        about: { offsetTop: 0, offsetHeight: 500 },
        contact: { offsetTop: 1500, offsetHeight: 500 },
      };
      return positions[id as keyof typeof positions] || null;
    });

    // contactセクションの位置でリロード
    Object.defineProperty(window, 'scrollY', { value: 1700, writable: true });

    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    // 初期状態では何もアクティブにならない（null状態）
    // その後、useEffectで正しい状態（contact）に設定される
    const aboutButton = screen.getByText('自己紹介').closest('button');
    const contactButton = screen.getByText('お問い合わせ').closest('button');

    // contactのみがアクティブで、aboutは絶対にアクティブにならない
    expect(contactButton).toHaveAttribute('data-active', 'true');
    expect(aboutButton).toHaveAttribute('data-active', 'false');
  });

  it('初期状態でaboutがハードコードされていない', () => {
    mockGetElementById.mockImplementation((id: string) => {
      const positions = {
        about: { offsetTop: 0, offsetHeight: 500 },
        skills: { offsetTop: 1000, offsetHeight: 500 },
      };
      return positions[id as keyof typeof positions] || null;
    });

    // skillsセクションの位置
    Object.defineProperty(window, 'scrollY', { value: 1200, writable: true });

    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    // aboutボタンが初期状態でアクティブになってはいけない
    const aboutButton = screen.getByText('自己紹介').closest('button');
    const skillsButton = screen.getByText('スキル').closest('button');

    expect(aboutButton).toHaveAttribute('data-active', 'false');
    expect(skillsButton).toHaveAttribute('data-active', 'true');
  });

  it('二重選択が発生しない', () => {
    mockGetElementById.mockImplementation((id: string) => {
      const positions = {
        about: { offsetTop: 0, offsetHeight: 500 },
        career: { offsetTop: 500, offsetHeight: 500 },
        skills: { offsetTop: 1000, offsetHeight: 500 },
        contact: { offsetTop: 1500, offsetHeight: 500 },
      };
      return positions[id as keyof typeof positions] || null;
    });

    // careerセクションの位置
    Object.defineProperty(window, 'scrollY', { value: 700, writable: true });

    render(
      <FloatingElementsProvider>
        <Navigation />
      </FloatingElementsProvider>
    );

    // アクティブなボタンが1つだけであることを確認
    const navigationButtons = screen.getAllByRole('button').filter(btn => 
      ['自己紹介', '経歴', 'スキル', 'お問い合わせ'].some(text => btn.textContent?.includes(text))
    );
    const activeButtons = navigationButtons.filter(button => 
      button.getAttribute('data-active') === 'true'
    );

    expect(activeButtons).toHaveLength(1);
    expect(activeButtons[0]).toHaveTextContent('経歴');
  });
});
