'use client';

import React, { useState } from 'react';

interface CareerProject {
  'No.': number;
  開始日: string;
  終了日: string;
  年数: number;
  月数: number;
  日数: number;
  案件内容: string;
  作業区分: string;
  プロジェクト人数: number | string;
  '使用機器・OS・データベース': string;
  '言語、フレームワーク': string;
}

interface CareerTableProps {
  projects: CareerProject[];
}

const CareerTable: React.FC<CareerTableProps> = ({ projects }) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [showLegend, setShowLegend] = useState<boolean>(false);

  const toggleRow = (projectNo: number) => {
    setExpandedRow(expandedRow === projectNo ? null : projectNo);
  };

  const formatPeriod = (years: number, months: number) => {
    if (years > 0) {
      return `${years}年${months}ヶ月`;
    }
    return `${months}ヶ月`;
  };

  const getProjectTitle = (content: string) => {
    if (!content) return '';
    return content.split('\n')[0];
  };

  const getProjectSummary = (content: string) => {
    if (!content) return '';
    const lines = content.split('\n');
    return lines.slice(1, 3).join('\n').trim();
  };

  const parseWorkDivisions = (divisions: string) => {
    if (!divisions) return [];
    return divisions
      .split(',')
      .map(d => d.trim())
      .filter(d => d);
  };

  const parseTechnologies = (tech: string) => {
    if (!tech) return [];
    return tech.split('\n').filter(t => t.trim() && !t.startsWith('・'));
  };

  const workDivisionLabels: Record<string, string> = {
    P: 'プロジェクト管理',
    SA: '分析・要求定義',
    SD: '概要設計',
    PD: '詳細設計',
    PG: 'プログラミング',
    PT: '単体テスト',
    ST: '結合テスト・システムテスト',
  };

  return (
    <div className="w-full">
      {/* 凡例ボタン */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="px-4 py-2 bg-color-accent-primary/20 text-color-accent-primary rounded-lg hover:bg-color-accent-primary/30 transition-colors duration-200 text-sm font-medium"
        >
          作業区分凡例 {showLegend ? '✕' : '?'}
        </button>
      </div>

      {/* ポップアップ凡例 */}
      {showLegend && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowLegend(false)}
        >
          <div
            className="bg-color-surface rounded-lg p-6 m-4 max-w-4xl w-full max-h-96 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-color-text">作業区分凡例</h3>
              <button
                onClick={() => setShowLegend(false)}
                className="text-color-text-muted hover:text-color-text text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(workDivisionLabels).map(([code, label]) => (
                <div key={code} className="flex flex-col items-center p-3 bg-color-background rounded-md">
                  <span className="bg-color-accent-secondary/20 text-color-accent-secondary px-3 py-1 rounded text-sm font-medium mb-2">
                    {code}
                  </span>
                  <span className="text-sm text-color-text text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* デスクトップ表示 */}
      <div className="hidden lg:block">
        <div className="modern-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-color-surface">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-color-text border-b border-color-border">
                    期間
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-color-text border-b border-color-border">
                    案件名
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-color-text border-b border-color-border">
                    期間
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-color-text border-b border-color-border">
                    規模
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-color-text border-b border-color-border">
                    作業区分
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-color-text border-b border-color-border">
                    主要技術
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <React.Fragment key={project['No.']}>
                    <tr
                      onClick={() => toggleRow(project['No.'])}
                      className={`cursor-pointer transition-all duration-200 hover:bg-color-hover ${
                        expandedRow === project['No.']
                          ? 'bg-color-surface'
                          : ''
                      } ${index % 2 === 0 ? 'bg-color-surface' : 'bg-color-background'}`}
                    >
                      <td className="px-4 py-3 text-sm text-color-text border-b border-color-border">
                        <div className="flex flex-col">
                          <span className="font-medium">{project.開始日}</span>
                          <span className="text-xs text-color-text-muted">↓</span>
                          <span className="font-medium">{project.終了日}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-color-text border-b border-color-border">
                        <div className="font-semibold">
                          {getProjectTitle(project.案件内容 || '')}
                        </div>
                        <div className="text-xs text-color-text-muted mt-1 line-clamp-2">
                          {getProjectSummary(project.案件内容 || '')}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-color-text border-b border-color-border">
                        <span className="bg-color-accent-primary/20 text-color-accent-primary px-2 py-1 rounded-full text-xs font-medium">
                          {formatPeriod(project.年数, project.月数)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-color-text border-b border-color-border">
                        <span className="bg-color-accent-secondary/20 text-color-accent-secondary px-2 py-1 rounded-full text-xs font-medium">
                          {project.プロジェクト人数}人
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-color-text border-b border-color-border">
                        <div className="flex flex-wrap gap-1">
                          {parseWorkDivisions(project.作業区分 || '')
                            .slice(0, 3)
                            .map((div, i) => (
                              <span
                                key={i}
                                className="bg-color-accent-primary/20 text-color-accent-primary px-2 py-1 rounded text-xs cursor-help"
                                title={workDivisionLabels[div] || div}
                              >
                                {div}
                              </span>
                            ))}
                          {parseWorkDivisions(project.作業区分 || '').length > 3 && (
                            <span className="text-xs text-color-text-muted">
                              +{parseWorkDivisions(project.作業区分 || '').length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-color-text border-b border-color-border">
                        <div className="flex flex-wrap gap-1">
                          {parseTechnologies(project['言語、フレームワーク'] || '')
                            .slice(0, 2)
                            .map((tech, i) => (
                              <span
                                key={i}
                                className="bg-color-accent-secondary/20 text-color-accent-secondary px-2 py-1 rounded text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          {parseTechnologies(project['言語、フレームワーク'] || '').length > 2 && (
                            <span className="text-xs text-color-text-muted">
                              +{parseTechnologies(project['言語、フレームワーク'] || '').length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedRow === project['No.'] && (
                      <tr>
                        <td colSpan={6} className="px-4 py-0 border-b border-color-border">
                          <div className="py-4 bg-color-background rounded-lg mb-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold text-color-text mb-2">案件詳細</h4>
                                  <div className="text-sm text-color-text whitespace-pre-wrap">
                                    {project.案件内容 || ''}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-color-text mb-2">作業区分</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {parseWorkDivisions(project.作業区分 || '').map((div, i) => (
                                      <span
                                        key={i}
                                        className="bg-color-accent-primary/20 text-color-accent-primary px-3 py-1 rounded-full text-sm font-medium cursor-help"
                                        title={workDivisionLabels[div] || div}
                                      >
                                        {div}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold text-color-text mb-2">使用技術</h4>
                                  <div className="text-sm text-color-text whitespace-pre-wrap">
                                    {project['言語、フレームワーク'] || ''}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-color-text mb-2">
                                    使用機器・OS・データベース
                                  </h4>
                                  <div className="text-sm text-color-text whitespace-pre-wrap">
                                    {project['使用機器・OS・データベース'] || ''}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* モバイル表示 */}
      <div className="lg:hidden space-y-4">
        {projects.map(project => (
          <div key={project['No.']} className="modern-card">
            <div
              onClick={() => toggleRow(project['No.'])}
              className="cursor-pointer p-4 transition-all duration-200 hover:bg-color-hover"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-color-text flex-1 mr-2">
                  {getProjectTitle(project.案件内容 || '')}
                </h3>
                <span className="text-xs text-color-text-muted whitespace-nowrap">
                  {project.開始日} - {project.終了日}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="bg-color-accent-primary/20 text-color-accent-primary px-2 py-1 rounded-full text-xs font-medium">
                  {formatPeriod(project.年数, project.月数)}
                </span>
                <span className="bg-color-accent-secondary/20 text-color-accent-secondary px-2 py-1 rounded-full text-xs font-medium">
                  {project.プロジェクト人数}人
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {parseWorkDivisions(project.作業区分 || '')
                  .slice(0, 4)
                  .map((div, i) => (
                    <span
                      key={i}
                      className="bg-color-accent-primary/20 text-color-accent-primary px-2 py-1 rounded text-xs cursor-help"
                      title={workDivisionLabels[div] || div}
                    >
                      {div}
                    </span>
                  ))}
              </div>
              <div className="text-xs text-color-text-muted line-clamp-2">
                {getProjectSummary(project.案件内容 || '')}
              </div>
            </div>
            {expandedRow === project['No.'] && (
              <div className="px-4 pb-4 bg-color-background rounded-b-lg">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-color-text mb-2">案件詳細</h4>
                    <div className="text-sm text-color-text whitespace-pre-wrap">
                      {project.案件内容 || ''}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-color-text mb-2">使用技術</h4>
                    <div className="text-sm text-color-text whitespace-pre-wrap">
                      {project['言語、フレームワーク'] || ''}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-color-text mb-2">使用機器・OS・データベース</h4>
                    <div className="text-sm text-color-text whitespace-pre-wrap">
                      {project['使用機器・OS・データベース'] || ''}
                    </div>
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

export default CareerTable;
