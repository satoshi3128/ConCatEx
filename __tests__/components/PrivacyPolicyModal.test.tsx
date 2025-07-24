import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';

describe('PrivacyPolicyModal', () => {
  const mockOnClose = vi.fn();
  const mockOnAgree = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('モーダルが正しく表示される', () => {
    render(<PrivacyPolicyModal isOpen={true} onClose={mockOnClose} onAgree={mockOnAgree} />);
    expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'プライバシーポリシーに同意して閉じる' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  });

  test('モーダルが閉じているときに何もレンダリングされない', () => {
    const { container } = render(
      <PrivacyPolicyModal isOpen={false} onClose={mockOnClose} onAgree={mockOnAgree} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('ESCキーで閉じる', () => {
    render(<PrivacyPolicyModal isOpen={true} onClose={mockOnClose} onAgree={mockOnAgree} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('オーバーレイクリックで閉じる', () => {
    render(<PrivacyPolicyModal isOpen={true} onClose={mockOnClose} onAgree={mockOnAgree} />);
    fireEvent.click(screen.getByLabelText('Close privacy policy modal'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('プライバシーポリシー内容が表示される', () => {
    render(<PrivacyPolicyModal isOpen={true} onClose={mockOnClose} onAgree={mockOnAgree} />);
    expect(screen.getByText('1. 取得する個人情報')).toBeInTheDocument();
    expect(screen.getByText('2. 利用目的')).toBeInTheDocument();
    expect(screen.getByText('3. 第三者への提供')).toBeInTheDocument();
    expect(screen.getByText('4. 情報の管理')).toBeInTheDocument();
    expect(screen.getByText('5. 注意事項')).toBeInTheDocument();
    expect(screen.getByText('6. 本ポリシーの変更')).toBeInTheDocument();
    expect(screen.getByText(/制定日: 2025年7月19日/)).toBeInTheDocument();
  });

  test('キャンセルボタンで閉じる', () => {
    render(<PrivacyPolicyModal isOpen={true} onClose={mockOnClose} onAgree={mockOnAgree} />);
    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('同意ボタンで同意処理が実行される', () => {
    render(<PrivacyPolicyModal isOpen={true} onClose={mockOnClose} onAgree={mockOnAgree} />);
    const agreeButton = screen.getByRole('button', {
      name: 'プライバシーポリシーに同意して閉じる',
    });
    fireEvent.click(agreeButton);
    expect(mockOnAgree).toHaveBeenCalledTimes(1);
  });
});
