import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  nav: {
    home: { ja: 'ホーム', en: 'Home' },
    about: { ja: '会社概要', en: 'About' },
    services: { ja: 'サービス', en: 'Services' },
    strengths: { ja: '強み', en: 'Strengths' },
    contact: { ja: 'お問い合わせ', en: 'Contact' },
  },
  hero: {
    title1: { ja: 'テクノロジーで', en: 'Creating the Future' },
    title2: { ja: '未来を創造する', en: 'with Technology' },
    subtitle: {
      ja: 'システム開発・ITコンサルティングで\nお客様のビジネスを次のステージへ',
      en: 'Elevating your business to the next level\nthrough system development & IT consulting',
    },
    cta1: { ja: 'サービスを見る', en: 'Our Services' },
    cta2: { ja: 'お問い合わせ', en: 'Contact Us' },
  },
  about: {
    title: { ja: '会社概要', en: 'About Us' },
    lead: {
      ja: '株式会社DLシステム海は、最新のテクノロジーとクリエイティブな発想で、お客様のビジネス課題を解決するITソリューション企業です。',
      en: 'DL System Umi is an IT solutions company that solves business challenges through cutting-edge technology and creative innovation.',
    },
    desc: {
      ja: 'システム開発、ソフトウェア開発、ITコンサルティングを通じて、お客様のデジタルトランスフォーメーション（DX）を支援します。小規模なプロジェクトから大規模なシステム構築まで、柔軟かつ確実な対応でお客様の期待を超える価値を提供します。',
      en: "We support our clients' digital transformation (DX) through system development, software development, and IT consulting. From small-scale projects to large-scale system construction, we deliver value that exceeds expectations with flexible and reliable solutions.",
    },
    companyName: { ja: '会社名', en: 'Company' },
    companyValue: { ja: '株式会社DLシステム海', en: 'DL System Umi Corporation' },
    corporateNumber: { ja: '法人番号', en: 'Corporate No.' },
    business: { ja: '事業内容', en: 'Business' },
    businessValue: {
      ja: 'システム開発 / ソフトウェア開発 / ITコンサルティング',
      en: 'System Development / Software Development / IT Consulting',
    },
    founded: { ja: '設立', en: 'Founded' },
    ceo: { ja: '代表者', en: 'CEO' },
    ceoValue: { ja: '代表取締役', en: 'Representative Director' },
    address: { ja: '所在地', en: 'Address' },
    addressValue: {
      ja: '〒349-0115 埼玉県蓮田市蓮田３丁目８４番２号\nマンション勝２０３号',
      en: '〒349-0115 3-84-2 Hasuda, Hasuda City,\nSaitama, Mansion Katsu #203',
    },
    phone: { ja: '電話番号', en: 'Phone' },
  },
  services: {
    title: { ja: 'サービス', en: 'Services' },
    desc: {
      ja: 'お客様のニーズに合わせた最適なITソリューションを提供します',
      en: 'We provide optimal IT solutions tailored to your needs',
    },
    system: {
      title: { ja: 'システム開発', en: 'System Development' },
      desc: {
        ja: '業務システム、Webアプリケーション、データベース設計など、お客様の業務効率化を実現するシステムを開発します。',
        en: 'We develop systems that streamline your business operations, including business systems, web applications, and database design.',
      },
      items: {
        ja: ['業務管理システム', 'Webアプリケーション開発', 'データベース設計・構築', 'API開発・連携'],
        en: ['Business Management Systems', 'Web Application Development', 'Database Design & Construction', 'API Development & Integration'],
      },
    },
    software: {
      title: { ja: 'ソフトウェア開発', en: 'Software Development' },
      desc: {
        ja: '最新の技術スタックを活用し、高品質で保守性の高いソフトウェアを設計・開発します。',
        en: 'We design and develop high-quality, maintainable software using the latest technology stacks.',
      },
      items: {
        ja: ['フロントエンド開発', 'バックエンド開発', 'モバイルアプリ開発', 'クラウドネイティブ開発'],
        en: ['Frontend Development', 'Backend Development', 'Mobile App Development', 'Cloud-Native Development'],
      },
    },
    consulting: {
      title: { ja: 'ITコンサルティング', en: 'IT Consulting' },
      desc: {
        ja: 'IT戦略の策定からシステム導入まで、お客様のDX推進を総合的にサポートします。',
        en: 'We provide comprehensive support for your DX initiatives, from IT strategy planning to system implementation.',
      },
      items: {
        ja: ['IT戦略立案', 'DX推進支援', 'システム導入支援', '技術選定・アーキテクチャ設計'],
        en: ['IT Strategy Planning', 'DX Promotion Support', 'System Implementation Support', 'Technology Selection & Architecture Design'],
      },
    },
  },
  strengths: {
    title: { ja: '私たちの強み', en: 'Our Strengths' },
    items: [
      {
        title: { ja: '最新技術への対応', en: 'Cutting-Edge Technology' },
        desc: {
          ja: '常に最新の技術トレンドをキャッチアップし、最適な技術選定でプロジェクトを成功に導きます。',
          en: 'We stay up-to-date with the latest technology trends and guide projects to success with optimal technology selection.',
        },
      },
      {
        title: { ja: '柔軟な対応力', en: 'Flexible Solutions' },
        desc: {
          ja: '小規模から大規模まで、お客様の規模やニーズに合わせた柔軟なサービス提供を行います。',
          en: 'We offer flexible services tailored to the scale and needs of each client, from small to large projects.',
        },
      },
      {
        title: { ja: '高品質な開発', en: 'High-Quality Development' },
        desc: {
          ja: '品質管理を徹底し、テスト駆動開発やコードレビューにより高品質なシステムを提供します。',
          en: 'We deliver high-quality systems through rigorous quality management, test-driven development, and code reviews.',
        },
      },
      {
        title: { ja: 'ワンストップサービス', en: 'One-Stop Service' },
        desc: {
          ja: '企画・設計から開発・運用まで、一貫したサービスでお客様の負担を軽減します。',
          en: 'We reduce your burden with end-to-end services from planning and design to development and operations.',
        },
      },
    ],
  },
  contact: {
    title: { ja: 'お問い合わせ', en: 'Contact Us' },
    desc: {
      ja: 'お気軽にご相談ください。お見積もりは無料です。',
      en: 'Feel free to reach out. Estimates are free.',
    },
    name: { ja: 'お名前', en: 'Name' },
    namePh: { ja: '山田 太郎', en: 'John Smith' },
    company: { ja: '会社名', en: 'Company' },
    companyPh: { ja: '株式会社〇〇', en: 'Company Name' },
    email: { ja: 'メールアドレス', en: 'Email' },
    subject: { ja: '件名', en: 'Subject' },
    subjectDefault: { ja: 'お選びください', en: 'Please select' },
    subjectSystem: { ja: 'システム開発について', en: 'System Development' },
    subjectSoftware: { ja: 'ソフトウェア開発について', en: 'Software Development' },
    subjectConsulting: { ja: 'ITコンサルティングについて', en: 'IT Consulting' },
    subjectOther: { ja: 'その他', en: 'Other' },
    message: { ja: 'お問い合わせ内容', en: 'Message' },
    messagePh: { ja: 'お問い合わせ内容をご記入ください', en: 'Please enter your message' },
    submit: { ja: '送信する', en: 'Send Message' },
    successTitle: { ja: '送信ありがとうございます', en: 'Thank you for your message' },
    successMsg: {
      ja: 'お問い合わせを受け付けました。内容を確認の上、折り返しご連絡いたします。',
      en: 'We have received your inquiry. We will review and get back to you shortly.',
    },
    addressLabel: { ja: '所在地', en: 'Address' },
    addressValue: {
      ja: '〒349-0115 埼玉県蓮田市蓮田３丁目８４番２号\nマンション勝２０３号',
      en: '〒349-0115 3-84-2 Hasuda, Hasuda City,\nSaitama, Mansion Katsu #203',
    },
    emailLabel: { ja: 'メール', en: 'Email' },
    phoneLabel: { ja: '電話', en: 'Phone' },
    hoursLabel: { ja: '営業時間', en: 'Business Hours' },
    hoursValue: { ja: '平日 9:00 - 18:00', en: 'Weekdays 9:00 - 18:00' },
  },
  footer: {
    slogan: { ja: 'テクノロジーで未来を創造する', en: 'Creating the Future with Technology' },
  },
  pageTitle: {
    ja: '株式会社DLシステム海 | システム開発・ITコンサルティング',
    en: 'DL System Umi | System Development & IT Consulting',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ja');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.title = translations.pageTitle[lang];
  }, [lang]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    if (value && typeof value === 'object' && lang in value) {
      return value[lang];
    }
    return value;
  };

  const toggleLang = () => setLang((prev) => (prev === 'ja' ? 'en' : 'ja'));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
