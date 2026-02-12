import { useLang } from '../context/LanguageContext';

export default function Hero() {
  const { lang, t } = useLang();

  const scrollTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <div className="hero-orb-1"></div>
        <div className="hero-orb-2"></div>
        <div className="hero-grid"></div>
      </div>
      <div className="container hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          {lang === 'ja' ? 'システム開発 & ITコンサルティング' : 'System Development & IT Consulting'}
        </div>
        <h1 className="hero-title">
          <span className="hero-title-line">{t('hero.title1')}</span>
          <span className="hero-title-line accent">{t('hero.title2')}</span>
        </h1>
        <p className="hero-subtitle">
          {t('hero.subtitle').split('\n').map((line, i) => (
            <span key={i}>{line}{i === 0 && <br />}</span>
          ))}
        </p>
        <div className="hero-actions">
          <a href="#services" className="btn btn-primary" onClick={(e) => scrollTo(e, 'services')}>
            {t('hero.cta1')}
          </a>
          <a href="#contact" className="btn btn-outline" onClick={(e) => scrollTo(e, 'contact')}>
            {t('hero.cta2')}
          </a>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
