import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer', () => {
  test('renders footer component', () => {
    render(<Footer />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  test('displays current year in copyright', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });

  test('displays copyright text with author name', () => {
    render(<Footer />);
    expect(screen.getByText(/© \d{4} 大野聡\. All Rights Reserved\./)).toBeInTheDocument();
  });

  test('has proper semantic structure', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-color-surface', 'border-t', 'border-color-border');
  });

  test('is responsive with proper layout classes', () => {
    render(<Footer />);
    const footerContainer = screen.getByRole('contentinfo').querySelector('div');
    expect(footerContainer).toHaveClass('max-w-7xl', 'mx-auto');
  });

  test('displays privacy policy link', () => {
    render(<Footer />);
    const privacyLink = screen.getByRole('link', { name: /プライバシーポリシー/ });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '/privacy-policy');
  });

  test('privacy policy link has proper styling', () => {
    render(<Footer />);
    const privacyLink = screen.getByRole('link', { name: /プライバシーポリシー/ });
    expect(privacyLink).toHaveClass('nexus-footer-link');
  });
});
