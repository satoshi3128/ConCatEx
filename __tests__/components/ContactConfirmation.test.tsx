import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ContactConfirmation from '@/components/ContactConfirmation';

describe('ContactConfirmation', () => {
  const mockFormData = {
    name: '山田太郎',
    email: 'yamada@example.com',
    message: 'これはテストメッセージです。\n複数行のテストです。',
  };

  const mockOnEdit = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnConfirm.mockClear();
  });

  it('確認画面が正しくレンダリングされる', () => {
    render(
      <ContactConfirmation
        formData={mockFormData}
        onEdit={mockOnEdit}
        onConfirm={mockOnConfirm}
        isSubmitting={false}
      />
    );

    expect(screen.getByText('送信内容の確認')).toBeInTheDocument();
    expect(screen.getByText('山田太郎')).toBeInTheDocument();
    expect(screen.getByText('yamada@example.com')).toBeInTheDocument();
    expect(screen.getByText(/これはテストメッセージです/)).toBeInTheDocument();
  });

  it('複数行のメッセージが正しく表示される', () => {
    render(
      <ContactConfirmation
        formData={mockFormData}
        onEdit={mockOnEdit}
        onConfirm={mockOnConfirm}
        isSubmitting={false}
      />
    );

    const messageElement = screen.getByText(/これはテストメッセージです/);
    expect(messageElement).toHaveClass('whitespace-pre-wrap');
  });

  it('修正ボタンがクリックされたときにonEditが呼ばれる', () => {
    render(
      <ContactConfirmation
        formData={mockFormData}
        onEdit={mockOnEdit}
        onConfirm={mockOnConfirm}
        isSubmitting={false}
      />
    );

    const editButton = screen.getByText('内容を修正する');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('送信ボタンがクリックされたときにonConfirmが呼ばれる', () => {
    render(
      <ContactConfirmation
        formData={mockFormData}
        onEdit={mockOnEdit}
        onConfirm={mockOnConfirm}
        isSubmitting={false}
      />
    );

    const confirmButton = screen.getByText('送信する');
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('送信中は両方のボタンが無効化される', () => {
    render(
      <ContactConfirmation
        formData={mockFormData}
        onEdit={mockOnEdit}
        onConfirm={mockOnConfirm}
        isSubmitting={true}
      />
    );

    const editButton = screen.getByRole('button', { name: /内容を修正する/ });
    const confirmButton = screen.getByRole('button', { name: /送信中/ });

    expect(editButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
  });

  it('送信中は送信ボタンのテキストが変わる', () => {
    render(
      <ContactConfirmation
        formData={mockFormData}
        onEdit={mockOnEdit}
        onConfirm={mockOnConfirm}
        isSubmitting={true}
      />
    );

    expect(screen.getByText('送信中...')).toBeInTheDocument();
    expect(screen.queryByText('送信する')).not.toBeInTheDocument();
  });

  it('フィールドラベルが正しく表示される', () => {
    render(
      <ContactConfirmation
        formData={mockFormData}
        onEdit={mockOnEdit}
        onConfirm={mockOnConfirm}
        isSubmitting={false}
      />
    );

    expect(screen.getByText('氏名')).toBeInTheDocument();
    expect(screen.getByText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByText('お問い合わせ内容')).toBeInTheDocument();
  });

  it('空のメッセージでも正しく表示される', () => {
    const emptyFormData = {
      name: '',
      email: '',
      message: '',
    };

    render(
      <ContactConfirmation
        formData={emptyFormData}
        onEdit={mockOnEdit}
        onConfirm={mockOnConfirm}
        isSubmitting={false}
      />
    );

    expect(screen.getByText('送信内容の確認')).toBeInTheDocument();
  });

  it('長いメッセージが正しく表示される', () => {
    const longFormData = {
      name: '山田太郎',
      email: 'yamada@example.com',
      message: 'これは非常に長いメッセージです。'.repeat(50),
    };

    render(
      <ContactConfirmation
        formData={longFormData}
        onEdit={mockOnEdit}
        onConfirm={mockOnConfirm}
        isSubmitting={false}
      />
    );

    expect(screen.getByText(/これは非常に長いメッセージです/)).toBeInTheDocument();
  });
});
