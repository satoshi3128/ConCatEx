import { render, screen } from '@testing-library/react';
import PrivacyPolicy from '@/app/privacy-policy/page';

describe('Privacy Policy Page', () => {
  test('renders privacy policy page', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument();
  });

  test('displays all required sections', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText('1. 取得する個人情報')).toBeInTheDocument();
    expect(screen.getByText('2. 利用目的')).toBeInTheDocument();
    expect(screen.getByText('3. 第三者への提供')).toBeInTheDocument();
    expect(screen.getByText('4. 情報の管理')).toBeInTheDocument();
    expect(screen.getByText('5. 注意事項')).toBeInTheDocument();
    expect(screen.getByText('6. 本ポリシーの変更')).toBeInTheDocument();
  });

  test('displays establishment date', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText(/制定日.*2025年7月19日/)).toBeInTheDocument();
  });
});
