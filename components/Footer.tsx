import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-color-surface border-t border-color-border py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-color-text-muted">&copy; {currentYear} 大野聡. All Rights Reserved.</p>
          <nav className="flex space-x-4 mt-2 md:mt-0">
            <Link
              href="/privacy-policy"
              className="nexus-footer-link"
            >
              プライバシーポリシー
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
