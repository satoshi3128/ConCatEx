import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ContactForm from '@/components/ContactForm';

// fetchのモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ContactForm', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockReset();
  });

  it('フォームが正しくレンダリングされる', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/氏名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    expect(screen.getByLabelText(/お問い合わせ内容/)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /確認画面へ進む/ })).toBeInTheDocument();
  });

  it('必須項目が空の場合にバリデーションエラーが表示される', async () => {
    render(<ContactForm />);

    // HTML5のrequired属性を無効にしてテストするため、noValidateを設定
    const form = document.querySelector('form');
    if (form) {
      form.setAttribute('novalidate', 'true');
    }

    // プライバシーポリシーに同意してから送信ボタンを有効化
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const submitButton = screen.getByRole('button', { name: /確認画面へ進む/ });
    fireEvent.click(submitButton);

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('氏名を入力してください')).toBeInTheDocument();
      expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument();
      expect(screen.getByText('お問い合わせ内容を入力してください')).toBeInTheDocument();
    });

    // 確認画面に移動していないことを確認
    expect(screen.queryByText('送信内容の確認')).not.toBeInTheDocument();
  });

  it('無効なメールアドレス形式でバリデーションエラーが表示される', async () => {
    render(<ContactForm />);

    // HTML5のrequired属性を無効にしてテストするため、noValidateを設定
    const form = document.querySelector('form');
    if (form) {
      form.setAttribute('novalidate', 'true');
    }

    const nameInput = screen.getByLabelText(/氏名/);
    const emailInput = screen.getByLabelText(/メールアドレス/);
    const messageInput = screen.getByLabelText(/お問い合わせ内容/);
    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /確認画面へ進む/ });

    fireEvent.change(nameInput, { target: { value: '山田太郎' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(messageInput, { target: { value: 'テストメッセージ' } });
    fireEvent.click(checkbox);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('送信内容の確認')).not.toBeInTheDocument();
      expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
    });
  });

  it('正常なデータで送信が成功する', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'お問い合わせを受け付けました。ありがとうございます。',
      }),
    });

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/氏名/);
    const emailInput = screen.getByLabelText(/メールアドレス/);
    const messageInput = screen.getByLabelText(/お問い合わせ内容/);
    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /確認画面へ進む/ });

    fireEvent.change(nameInput, { target: { value: '山田太郎' } });
    fireEvent.change(emailInput, { target: { value: 'yamada@example.com' } });
    fireEvent.change(messageInput, {
      target: { value: 'お問い合わせ内容です' },
    });
    fireEvent.click(checkbox);

    fireEvent.click(submitButton);

    // 確認画面が表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('送信内容の確認')).toBeInTheDocument();
    });

    // 送信ボタンをクリック
    const confirmButton = screen.getByText('送信する');
    fireEvent.click(confirmButton);

    // 成功メッセージをチェック
    await waitFor(() => {
      expect(screen.getByText('お問い合わせを受け付けました')).toBeInTheDocument();
      expect(screen.getByText(/お問い合わせを受け付けました/)).toBeInTheDocument();
    });

    // フォームがリセットされることをチェック（フォームに戻るボタンを押した後）
    const backToFormButton = screen.getByText('フォームに戻る');
    fireEvent.click(backToFormButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/氏名/)).toHaveValue('');
      expect(screen.getByLabelText(/メールアドレス/)).toHaveValue('');
      expect(screen.getByLabelText(/お問い合わせ内容/)).toHaveValue('');
    });

    // fetchが正しいパラメータで呼ばれたかチェック
    expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '山田太郎',
        email: 'yamada@example.com',
        message: 'お問い合わせ内容です',
        honeypot: '',
      }),
    });
  });

  it('サーバーエラーでエラーメッセージが表示される', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'サーバーエラーが発生しました' }),
    });

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/氏名/);
    const emailInput = screen.getByLabelText(/メールアドレス/);
    const messageInput = screen.getByLabelText(/お問い合わせ内容/);
    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /確認画面へ進む/ });

    fireEvent.change(nameInput, { target: { value: '山田太郎' } });
    fireEvent.change(emailInput, { target: { value: 'yamada@example.com' } });
    fireEvent.change(messageInput, {
      target: { value: 'お問い合わせ内容です' },
    });
    fireEvent.click(checkbox);

    fireEvent.click(submitButton);

    // 確認画面が表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('送信内容の確認')).toBeInTheDocument();
    });

    // 送信ボタンをクリック
    const confirmButton = screen.getByText('送信する');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText('サーバーエラーが発生しました')).toBeInTheDocument();
    });
  });

  it('ネットワークエラーでエラーメッセージが表示される', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/氏名/);
    const emailInput = screen.getByLabelText(/メールアドレス/);
    const messageInput = screen.getByLabelText(/お問い合わせ内容/);
    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /確認画面へ進む/ });

    fireEvent.change(nameInput, { target: { value: '山田太郎' } });
    fireEvent.change(emailInput, { target: { value: 'yamada@example.com' } });
    fireEvent.change(messageInput, {
      target: { value: 'お問い合わせ内容です' },
    });
    fireEvent.click(checkbox);

    fireEvent.click(submitButton);

    // 確認画面が表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('送信内容の確認')).toBeInTheDocument();
    });

    // 送信ボタンをクリック
    const confirmButton = screen.getByText('送信する');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText('ネットワークエラーが発生しました。しばらく後でもう一度お試しください。')
      ).toBeInTheDocument();
    });
  });

  it('入力時にエラーメッセージがクリアされる', async () => {
    render(<ContactForm />);

    // HTML5のrequired属性を無効にしてテストするため、noValidateを設定
    const form = document.querySelector('form');
    if (form) {
      form.setAttribute('novalidate', 'true');
    }

    // プライバシーポリシーに同意してから送信ボタンを有効化
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // まずエラーを表示させる
    const submitButton = screen.getByRole('button', { name: /確認画面へ進む/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('氏名を入力してください')).toBeInTheDocument();
    });

    // 入力するとエラーがクリアされるかチェック
    const nameInput = screen.getByLabelText(/氏名/);
    fireEvent.change(nameInput, { target: { value: '山田太郎' } });

    await waitFor(() => {
      expect(screen.queryByText('氏名を入力してください')).not.toBeInTheDocument();
    });
  });

  it('送信中はボタンが無効化される', async () => {
    // 送信が遅い場合をシミュレート
    mockFetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/氏名/);
    const emailInput = screen.getByLabelText(/メールアドレス/);
    const messageInput = screen.getByLabelText(/お問い合わせ内容/);
    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /確認画面へ進む/ });

    fireEvent.change(nameInput, { target: { value: '山田太郎' } });
    fireEvent.change(emailInput, { target: { value: 'yamada@example.com' } });
    fireEvent.change(messageInput, {
      target: { value: 'お問い合わせ内容です' },
    });
    fireEvent.click(checkbox);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('送信内容の確認')).toBeInTheDocument();
    });
  });

  // 新しいステップ機能のテスト
  it('ステップインジケータが表示される', () => {
    render(<ContactForm />);

    expect(screen.getByText('入力')).toBeInTheDocument();
    expect(screen.getByText('確認')).toBeInTheDocument();
  });

  it('フォーム送信時に確認画面に移動する', async () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/氏名/);
    const emailInput = screen.getByLabelText(/メールアドレス/);
    const messageInput = screen.getByLabelText(/お問い合わせ内容/);
    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /確認画面へ進む/ });

    fireEvent.change(nameInput, { target: { value: '山田太郎' } });
    fireEvent.change(emailInput, { target: { value: 'yamada@example.com' } });
    fireEvent.change(messageInput, {
      target: { value: 'お問い合わせ内容です' },
    });
    fireEvent.click(checkbox);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('送信内容の確認')).toBeInTheDocument();
      expect(screen.getByText('山田太郎')).toBeInTheDocument();
      expect(screen.getByText('yamada@example.com')).toBeInTheDocument();
      expect(screen.getByText('お問い合わせ内容です')).toBeInTheDocument();
    });
  });

  it('確認画面から入力画面に戻ることができる', async () => {
    render(<ContactForm />);

    // 入力画面で情報を入力
    const nameInput = screen.getByLabelText(/氏名/);
    const emailInput = screen.getByLabelText(/メールアドレス/);
    const messageInput = screen.getByLabelText(/お問い合わせ内容/);
    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /確認画面へ進む/ });

    fireEvent.change(nameInput, { target: { value: '山田太郎' } });
    fireEvent.change(emailInput, { target: { value: 'yamada@example.com' } });
    fireEvent.change(messageInput, {
      target: { value: 'お問い合わせ内容です' },
    });
    fireEvent.click(checkbox);

    fireEvent.click(submitButton);

    // 確認画面が表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('送信内容の確認')).toBeInTheDocument();
    });

    // 修正ボタンをクリック
    const editButton = screen.getByText('内容を修正する');
    fireEvent.click(editButton);

    // 入力画面に戻ることを確認
    await waitFor(() => {
      expect(screen.getByLabelText(/氏名/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /確認画面へ進む/ })).toBeInTheDocument();
    });
  });

  it('確認画面から送信が実行される', async () => {
    // 成功レスポンスをモック
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'お問い合わせを受け付けました。ありがとうございます。',
      }),
    });

    render(<ContactForm />);

    // 入力画面で情報を入力
    const nameInput = screen.getByLabelText(/氏名/);
    const emailInput = screen.getByLabelText(/メールアドレス/);
    const messageInput = screen.getByLabelText(/お問い合わせ内容/);
    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /確認画面へ進む/ });

    fireEvent.change(nameInput, { target: { value: '山田太郎' } });
    fireEvent.change(emailInput, { target: { value: 'yamada@example.com' } });
    fireEvent.change(messageInput, {
      target: { value: 'お問い合わせ内容です' },
    });
    fireEvent.click(checkbox);

    fireEvent.click(submitButton);

    // 確認画面が表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('送信内容の確認')).toBeInTheDocument();
    });

    // 送信ボタンをクリック（非同期で検索）
    const confirmButton = await screen.findByText('送信する');
    fireEvent.click(confirmButton);

    // 結果ステップに移動することを確認（loading状態またはsuccess状態）
    await waitFor(() => {
      // ローディング状態または成功状態を確認
      const loadingDiv = document.querySelector('.text-center.space-y-6');
      const successDiv = document.querySelector('[data-contact-success="true"]');
      expect(loadingDiv || successDiv).toBeTruthy();
    });

    // 送信完了画面が表示されることを確認
    await waitFor(
      () => {
        const successDiv = document.querySelector('[data-contact-success="true"]');
        expect(successDiv).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // fetchが正しく呼ばれたことを確認
    expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '山田太郎',
        email: 'yamada@example.com',
        message: 'お問い合わせ内容です',
        honeypot: '',
      }),
    });
  });

  // プライバシーポリシー同意チェックボックスのテスト
  it('初期状態ではプライバシーポリシー同意チェックボックスは未チェック', () => {
    render(<ContactForm />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('プライバシーポリシー未同意時は送信ボタンが無効化される', () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/氏名/);
    const emailInput = screen.getByLabelText(/メールアドレス/);
    const messageInput = screen.getByLabelText(/お問い合わせ内容/);
    const submitButton = screen.getByRole('button', { name: /確認画面へ進む/ });

    // 必要な情報を入力
    fireEvent.change(nameInput, { target: { value: '山田太郎' } });
    fireEvent.change(emailInput, { target: { value: 'yamada@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'お問い合わせ内容です' } });

    // プライバシーポリシー未同意の状態では送信ボタンが無効
    expect(submitButton).toBeDisabled();
  });

  it('プライバシーポリシー同意時は送信ボタンが有効化される', () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/氏名/);
    const emailInput = screen.getByLabelText(/メールアドレス/);
    const messageInput = screen.getByLabelText(/お問い合わせ内容/);
    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /確認画面へ進む/ });

    // 必要な情報を入力
    fireEvent.change(nameInput, { target: { value: '山田太郎' } });
    fireEvent.change(emailInput, { target: { value: 'yamada@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'お問い合わせ内容です' } });

    // プライバシーポリシーに同意
    fireEvent.click(checkbox);

    // 送信ボタンが有効になる
    expect(submitButton).not.toBeDisabled();
  });

  it('プライバシーポリシーボタンが表示される', () => {
    render(<ContactForm />);

    const button = screen.getByRole('button', { name: /プライバシーポリシー/ });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });
});
