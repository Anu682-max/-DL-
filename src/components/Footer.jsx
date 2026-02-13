import { useLang } from '../context/LanguageContext';
import LogoIcon from './LogoIcon';

export default function Footer() {
  const { t } = useLang();

  const scrollTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const links = [
    { id: 'home', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'services', label: t('nav.services') },
    { id: 'strengths', label: t('nav.strengths') },
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="#" className="logo" onClick={(e) => scrollTo(e, 'home')}>
              <LogoIcon size={36} />
              <span className="logo-text">株式会社DLシステム海</span>
            </a>
            <p className="footer-desc">{t('footer.slogan')}</p>
          </div>
          <div className="footer-links">
            {links.map((link) => (
              <a key={link.id} href={`#${link.id}`} onClick={(e) => scrollTo(e, link.id)}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 株式会社DLシステム海. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
