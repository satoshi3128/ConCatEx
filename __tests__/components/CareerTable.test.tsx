import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import CareerTable from '@/components/CareerTable';

const mockProjects = [
  {
    'No.': 1,
    開始日: '2025-03-27',
    終了日: '2025-06-30',
    年数: 0,
    月数: 4,
    日数: 95,
    案件内容: '次世代会計システム\n\nシステム概要：\n・クラウド会計システム刷新',
    作業区分: 'PD,PG,PT,ST',
    プロジェクト人数: 70,
    '使用機器・OS・データベース': 'Windows\nAWS\nDocker',
    '言語、フレームワーク': '言語\n・C#\n\nGrapQLプラットフォーム\n・Hot Chocolate',
  },
  {
    'No.': 2,
    開始日: '2024-10-01',
    終了日: '2025-01-31',
    年数: 0,
    月数: 4,
    日数: 122,
    案件内容: '旅行会社システム改修\n\nシステム概要：\n・パッケージツアー予約システムの刷新',
    作業区分: 'PD,PG,PT,ST',
    プロジェクト人数: 20,
    '使用機器・OS・データベース': 'Windows\nPostgreSQL',
    '言語、フレームワーク': 'C#\nASP.NET MVC\nEntity Framework Core',
  },
];

const mockProjectsWithNulls = [
  {
    'No.': 1,
    開始日: '2025-03-27',
    終了日: '2025-06-30',
    年数: 0,
    月数: 4,
    日数: 95,
    案件内容: null,
    作業区分: null,
    プロジェクト人数: 70,
    '使用機器・OS・データベース': null,
    '言語、フレームワーク': null,
  },
];

describe('CareerTable', () => {
  test('renders table with project data', () => {
    render(<CareerTable projects={mockProjects} />);

    // Check if project titles are rendered (using getAllByText since they appear in both desktop and mobile views)
    expect(screen.getAllByText('次世代会計システム')).toHaveLength(2);
    expect(screen.getAllByText('旅行会社システム改修')).toHaveLength(2);

    // Check if dates are rendered
    expect(screen.getByText('2025-03-27')).toBeInTheDocument();
    expect(screen.getByText('2025-06-30')).toBeInTheDocument();

    // Check if project size is rendered
    expect(screen.getAllByText('70人')).toHaveLength(2);
    expect(screen.getAllByText('20人')).toHaveLength(2);
  });

  test('expands project details when row is clicked', () => {
    render(<CareerTable projects={mockProjects} />);

    // Initially, detailed content should not be visible
    expect(screen.queryAllByText('案件詳細')).toHaveLength(0);

    // Click on the first project row (desktop view)
    const firstRow = screen.getAllByText('次世代会計システム')[0].closest('tr');
    fireEvent.click(firstRow!);

    // Now detailed content should be visible (desktop + mobile = 2 instances)
    expect(screen.getAllByText('案件詳細')).toHaveLength(2);
    expect(screen.getAllByText('使用技術')).toHaveLength(2);
    expect(screen.getAllByText('使用機器・OS・データベース')).toHaveLength(2);
    // Additional content checks can be added here
  });

  test('collapses project details when row is clicked again', () => {
    render(<CareerTable projects={mockProjects} />);

    // Click to expand
    const firstRow = screen.getAllByText('次世代会計システム')[0].closest('tr');
    fireEvent.click(firstRow!);

    // Details should be visible (desktop + mobile = 2 instances)
    expect(screen.getAllByText('案件詳細')).toHaveLength(2);

    // Click again to collapse
    fireEvent.click(firstRow!);

    // Details should be hidden
    expect(screen.queryAllByText('案件詳細')).toHaveLength(0);
  });

  test('handles null/undefined values gracefully', () => {
    render(<CareerTable projects={mockProjectsWithNulls} />);

    // Should render without crashing
    expect(screen.getByText('2025-03-27')).toBeInTheDocument();
    expect(screen.getAllByText('70人')).toHaveLength(2);

    // Click to expand - should not crash
    const firstRow = screen.getAllByText('70人')[0].closest('tr');
    fireEvent.click(firstRow!);

    // Should render empty content areas (desktop + mobile = 2 instances)
    expect(screen.getAllByText('案件詳細')).toHaveLength(2);
    expect(screen.getAllByText('使用技術')).toHaveLength(2);
  });

  test('parses work divisions correctly', () => {
    render(<CareerTable projects={mockProjects} />);

    // Check if work divisions are parsed and displayed as tags
    expect(screen.getAllByText('PD').length).toBeGreaterThan(0);
    expect(screen.getAllByText('PG').length).toBeGreaterThan(0);
    expect(screen.getAllByText('PT').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ST').length).toBeGreaterThan(0);
  });

  test('displays project period correctly', () => {
    render(<CareerTable projects={mockProjects} />);

    // Check if the period is formatted correctly
    expect(screen.getAllByText('4ヶ月').length).toBeGreaterThan(0);
  });

  test('shows expanded details on click', () => {
    render(<CareerTable projects={mockProjects} />);

    // Click to expand first project
    const firstRow = screen.getAllByText('次世代会計システム')[0].closest('tr');
    fireEvent.click(firstRow!);

    // Check if expanded content is visible (desktop + mobile = 2 instances)
    expect(screen.getAllByText('案件詳細')).toHaveLength(2);
    expect(screen.getAllByText('使用技術')).toHaveLength(2);
    expect(screen.getAllByText('使用機器・OS・データベース')).toHaveLength(2);
  });

  test('shows legend popup when legend button is clicked', () => {
    render(<CareerTable projects={mockProjects} />);

    // Find and click the legend button
    const legendButton = screen.getByText(/作業区分凡例/);
    fireEvent.click(legendButton);

    // Check if legend popup is shown
    expect(screen.getByText('プロジェクト管理')).toBeInTheDocument();
    expect(screen.getByText('詳細設計')).toBeInTheDocument();
    expect(screen.getByText('プログラミング')).toBeInTheDocument();
    expect(screen.getByText('単体テスト')).toBeInTheDocument();
    expect(screen.getByText('結合テスト・システムテスト')).toBeInTheDocument();
  });

  test('closes legend popup when background is clicked', () => {
    render(<CareerTable projects={mockProjects} />);

    // Open legend popup
    const legendButton = screen.getByText(/作業区分凡例/);
    fireEvent.click(legendButton);

    // Verify popup is open
    expect(screen.getByText('プロジェクト管理')).toBeInTheDocument();

    // Click background (the overlay div)
    const overlay = screen.getByText('プロジェクト管理').closest('div[class*="fixed"]');
    fireEvent.click(overlay!);

    // Verify popup is closed
    expect(screen.queryByText('プロジェクト管理')).not.toBeInTheDocument();
  });

  test('closes legend popup when close button is clicked', () => {
    render(<CareerTable projects={mockProjects} />);

    // Open legend popup
    const legendButton = screen.getByText(/作業区分凡例/);
    fireEvent.click(legendButton);

    // Verify popup is open
    expect(screen.getByText('プロジェクト管理')).toBeInTheDocument();

    // Click close button (×)
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    // Verify popup is closed
    expect(screen.queryByText('プロジェクト管理')).not.toBeInTheDocument();
  });

  test('prevents legend popup from closing when content is clicked', () => {
    render(<CareerTable projects={mockProjects} />);

    // Open legend popup
    const legendButton = screen.getByText(/作業区分凡例/);
    fireEvent.click(legendButton);

    // Verify popup is open
    expect(screen.getByText('プロジェクト管理')).toBeInTheDocument();

    // Click on the popup content (should not close)
    const popupContent = screen.getByText('プロジェクト管理');
    fireEvent.click(popupContent);

    // Verify popup is still open
    expect(screen.getByText('プロジェクト管理')).toBeInTheDocument();
  });

  test('formats project period with years and months', () => {
    const projectWithYears = [
      {
        ...mockProjects[0],
        年数: 2,
        月数: 3,
      },
    ];

    render(<CareerTable projects={projectWithYears} />);

    // Should show years and months (desktop + mobile views)
    expect(screen.getAllByText('2年3ヶ月')).toHaveLength(2);
  });

  test('handles empty projects array', () => {
    render(<CareerTable projects={[]} />);

    // Should render table structure without crashing
    expect(screen.getAllByText('案件名')).toHaveLength(1);
    expect(screen.getAllByText('規模')).toHaveLength(1);
  });

  test('mobile view renders correctly', () => {
    render(<CareerTable projects={mockProjects} />);

    // Check if mobile-specific elements are present (both desktop and mobile render)
    expect(screen.getAllByText('次世代会計システム')).toHaveLength(2);
    expect(screen.getAllByText('旅行会社システム改修')).toHaveLength(2);
  });

  test('displays project information correctly', () => {
    render(<CareerTable projects={mockProjects} />);

    // Check basic information is displayed
    expect(screen.getByText('2025-03-27')).toBeInTheDocument();
    expect(screen.getByText('2025-06-30')).toBeInTheDocument();
    expect(screen.getByText('2024-10-01')).toBeInTheDocument();
    expect(screen.getByText('2025-01-31')).toBeInTheDocument();
  });

  test('handles project expansion state correctly', () => {
    render(<CareerTable projects={mockProjects} />);

    // Initially no expanded content
    expect(screen.queryAllByText('案件詳細')).toHaveLength(0);

    // Click first project
    const firstRow = screen.getAllByText('次世代会計システム')[0].closest('tr');
    fireEvent.click(firstRow!);

    // Should show expanded content (desktop + mobile = 2 instances)
    expect(screen.getAllByText('案件詳細')).toHaveLength(2);

    // Click second project
    const secondRow = screen.getAllByText('旅行会社システム改修')[0].closest('tr');
    fireEvent.click(secondRow!);

    // Should still show only one expanded content (second project) - desktop + mobile = 2 instances
    expect(screen.getAllByText('案件詳細')).toHaveLength(2);
    // Additional content checks can be added here
  });
});
