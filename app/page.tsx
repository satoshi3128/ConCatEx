import { getResumeData, getMarkdownContent, getSkillsData } from '@/utils/content';
import CareerTable from '@/components/CareerTable';
import ContactForm from '@/components/ContactForm';
import SkillsSection from '@/components/SkillsSection';
import FloatingElements from '@/components/FloatingElements';

export default async function Home() {
  const [resumeData, aboutContent, skillsData, activitiesContent] = await Promise.all([
    getResumeData(),
    getMarkdownContent('about.md'),
    getSkillsData(),
    getMarkdownContent('activities.md'),
  ]);

  // const recentProjects = resumeData.slice(0, 5);

  return (
    <div className="pt-20">
      {/* 自己紹介セクション */}
      <section
        id="about"
        className="min-h-screen scroll-snap-section flex items-center justify-center px-8 py-16 section-monochrome-1 relative"
      >
        <FloatingElements />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="modern-card p-8 md:p-12 animate-fade-in-up">
            <div
              className="prose prose-lg max-w-none text-color-text"
              dangerouslySetInnerHTML={{ __html: aboutContent }}
            />
          </div>
        </div>
      </section>

      {/* 経歴セクション */}
      <section
        id="career"
        className="min-h-screen scroll-snap-section flex items-center justify-center px-8 py-16 section-monochrome-2 relative"
      >
        <FloatingElements />
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-color-text mb-4 animate-fade-in-up">
              経歴
            </h2>
            <p
              className="text-xl text-color-text-muted animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              これまでの全プロジェクトの詳細経歴
            </p>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-color-text text-center animate-slide-in-left">
              職務経歴一覧
            </h3>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <CareerTable projects={resumeData} />
            </div>
          </div>
        </div>
      </section>

      {/* スキルセクション */}
      <section
        id="skills"
        className="min-h-screen scroll-snap-section flex items-center justify-center px-8 py-16 section-monochrome-3 relative"
      >
        <FloatingElements />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="modern-card p-8 md:p-12 animate-fade-in-up">
            <div className="mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-color-text mb-8 text-center animate-fade-in-up">
                技術スキル
              </h2>
            </div>
            <SkillsSection skillsData={skillsData} />
          </div>
        </div>
      </section>

      {/* 活動セクション */}
      <section
        id="activities"
        className="min-h-screen scroll-snap-section flex items-center justify-center px-8 py-16 section-monochrome-4 relative"
      >
        <FloatingElements />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-color-text mb-4 animate-fade-in-up">
              活動・アウトプット
            </h2>
            <p
              className="text-xl text-color-text-muted animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              技術的な取り組みと成果
            </p>
          </div>
          <div className="modern-card p-8 md:p-12 animate-fade-in-up">
            <div
              className="prose prose-lg max-w-none text-color-text"
              dangerouslySetInnerHTML={{ __html: activitiesContent }}
            />
          </div>
        </div>
      </section>

      {/* お問い合わせセクション */}
      <section
        id="contact"
        className="min-h-screen scroll-snap-section flex items-center justify-center px-8 py-16 section-monochrome-5 relative"
      >
        <FloatingElements />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-color-text mb-4 animate-fade-in-up">
              お問い合わせ
            </h2>
            <p
              className="text-xl text-color-text-muted animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              お気軽にご連絡ください
            </p>
          </div>
          <div className="modern-card p-8 md:p-12 animate-scale-in">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
