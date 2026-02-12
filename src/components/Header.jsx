import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

export default function Header() {
  const { lang, toggleLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const links = [
    { id: 'home', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'services', label: t('nav.services') },
    { id: 'strengths', label: t('nav.strengths') },
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a href="#" className="logo" onClick={(e) => handleNav(e, 'home')}>
          <span className="logo-icon">DL</span>
          <span className="logo-text">株式会社DLシステム海</span>
        </a>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="nav-link"
              onClick={(e) => handleNav(e, link.id)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button className="lang-toggle" onClick={toggleLang} title="Switch Language">
          {lang === 'ja' ? 'EN' : 'JA'}
        </button>
        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
