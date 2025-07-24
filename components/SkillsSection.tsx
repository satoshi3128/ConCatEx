'use client';

import React, { useState } from 'react';

interface SkillItem {
  name: string;
  experience: string;
  notes: string;
}

interface SkillCategory {
  name: string;
  icon: string;
  items: SkillItem[];
}

interface SkillsData {
  overview: string;
  categories: SkillCategory[];
}

interface SkillsSectionProps {
  skillsData: SkillsData;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skillsData }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const isExpanded = (categoryName: string) => expandedCategories.has(categoryName);

  return (
    <div className="space-y-6">
      {/* 概要説明 */}
      <div className="prose prose-lg max-w-none text-color-text mb-8">
        <p className="leading-relaxed">{skillsData.overview}</p>
      </div>

      {/* スキルカテゴリアコーディオン */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-color-text mb-6">主な技術スタック・スキルの経験期間サマリー</h2>
        
        {skillsData.categories.map((category, index) => (
          <div
            key={category.name}
            className="modern-card-mini overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* アコーディオンヘッダー */}
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-color-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-color-accent-primary focus:ring-opacity-50"
              aria-expanded={isExpanded(category.name)}
              aria-controls={`skills-${category.name}`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl" role="img" aria-label={category.name}>
                  {category.icon}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-color-text">
                    {category.name}
                  </h3>
                  <p className="text-sm text-color-text-muted">
                    {category.items.length}項目
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-color-text-subtle hidden sm:block">
                  {isExpanded(category.name) ? '閉じる' : '詳細を見る'}
                </span>
                <svg
                  className={`w-5 h-5 text-color-text-subtle transition-transform duration-300 ${
                    isExpanded(category.name) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {/* アコーディオンコンテンツ */}
            {isExpanded(category.name) && (
              <div
                id={`skills-${category.name}`}
                className="overflow-hidden transition-all duration-500 ease-in-out animate-fade-in-up"
              >
              <div className="px-6 pb-6 pt-2 border-t border-color-border">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-color-border">
                        <th className="text-left py-3 px-4 font-semibold text-color-text bg-color-background rounded-tl-lg">
                          技術・スキル
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-color-text bg-color-background">
                          実経験期間
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-color-text bg-color-background rounded-tr-lg">
                          備考・代表案件例
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((item, itemIndex) => (
                        <tr
                          key={item.name}
                          className={`border-b border-color-border hover:bg-color-hover transition-colors duration-200 ${
                            itemIndex % 2 === 0 ? 'bg-color-surface' : 'bg-color-background'
                          }`}
                        >
                          <td className="py-3 px-4 font-medium text-color-text">
                            {item.name}
                          </td>
                          <td className="py-3 px-4 text-color-text-muted font-mono text-sm">
                            {item.experience}
                          </td>
                          <td className="py-3 px-4 text-color-text-muted text-sm leading-relaxed">
                            {item.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;