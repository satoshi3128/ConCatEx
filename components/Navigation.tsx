'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import DarkModeToggle from './DarkModeToggle';
import FloatingToggle from './FloatingToggle';
import { useFloatingElements } from './FloatingElementsProvider';

const Navigation = () => {
  const { setFloatingEnabled } = useFloatingElements();
  
  const sections = useMemo(
    () => [
      { id: 'about', label: '自己紹介' },
      { id: 'career', label: '経歴' },
      { id: 'skills', label: 'スキル' },
      { id: 'activities', label: '活動' },
      { id: 'contact', label: 'お問い合わせ' },
    ],
    []
  );

  // 現在のスクロール位置から正しいアクティブセクションを計算
  const calculateActiveSection = useCallback(() => {
    const scrollPosition = window.scrollY + 100;

    // 成功画面が表示されている場合はナビゲーションを中立化
    const successScreen = document.querySelector('[data-contact-success="true"]');
    if (successScreen) {
      return '';
    }

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          return section.id;
        }
      }
    }

    return 'about'; // デフォルトは自己紹介
  }, [sections]);

  // 初期状態はnullにして、マウント時に正しい状態を設定
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const newActiveSection = calculateActiveSection();
      setActiveSection(newActiveSection);
    };

    // マウント時に一度だけ正しい初期状態を設定
    const initialActiveSection = calculateActiveSection();
    setActiveSection(initialActiveSection);

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [calculateActiveSection]);


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-md" style={{backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(8px)'}}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex justify-center space-x-2 md:space-x-8 flex-1">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="nexus-nav-button"
                data-active={activeSection === section.id}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <span className="text-sm md:text-base" style={{ color: 'currentColor' }}>{section.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <FloatingToggle onToggle={setFloatingEnabled} />
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
