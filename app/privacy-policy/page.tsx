import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー - 大野聡',
  description: 'お問い合わせフォームで取得する個人情報の取り扱いについて',
};

export default function PrivacyPolicy() {
  return (
    <div className="pt-20 min-h-screen bg-color-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-color-surface rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold text-color-text mb-8 text-center">
            プライバシーポリシー
          </h1>
          <div className="space-y-6 text-color-text">
            <p>
              大野聡（以下、「当方」といいます）は、当サイトのお問い合わせフォームを通じて取得する個人情報の取り扱いについて、以下の通りプライバシーポリシー（以下、「本ポリシー」といいます）を定めます。
            </p>
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-color-text">1. 取得する個人情報</h2>
              <p>当サイトでは、お問い合わせフォームから以下の情報を取得します。</p>
              <ul className="list-disc list-inside pl-4">
                <li>氏名</li>
                <li>メールアドレス</li>
                <li>お問い合わせ内容</li>
              </ul>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-color-text">2. 利用目的</h2>
              <p>
                取得した個人情報は、お問い合わせに対する回答や、必要な情報を電子メールでご連絡する場合に利用するものであり、これらの目的以外では利用いたしません。
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-color-text">3. 第三者への提供</h2>
              <p>
                当方は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-color-text">4. 情報の管理</h2>
              <p>
                取得した個人情報は、当方のメールシステム内にて厳重に管理いたします。お問い合わせへの返信が完了し、以降の連絡が不要になったと判断した場合、取得した個人情報は速やかに破棄いたします。
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-color-text">5. 注意事項</h2>
              <p>
                お問い合わせフォームには、クレジットカード情報やその他、特に機密性の高い情報は入力しないようお願いいたします。当方では、お問い合わせ内容に含まれる機密情報の管理について、特別な責任を負うことはできかねますので、あらかじめご了承ください。
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-color-text">6. 本ポリシーの変更</h2>
              <p>
                本ポリシーの内容は、予告なく変更されることがあります。変更後の本ポリシーについては、当サイトに掲載した時から効力を生じるものとします。
              </p>
            </section>
            <p className="text-right mt-8">制定日: 2025年7月19日</p>
          </div>
        </div>
      </div>
    </div>
  );
}
