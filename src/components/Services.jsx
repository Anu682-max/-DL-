import { useEffect, useRef } from 'react';
import { useLang } from '../context/LanguageContext';

const icons = {
  system: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  software: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  ),
  consulting: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
};

export default function Services() {
  const { t } = useLang();
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    cardsRef.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const services = ['system', 'software', 'consulting'];

  return (
    <section className="section section-alt" id="services">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Services</span>
          <h2 className="section-title">{t('services.title')}</h2>
          <p className="section-desc">{t('services.desc')}</p>
        </div>
        <div className="services-grid">
          {services.map((key, i) => (
            <div
              key={key}
              className="service-card fade-in"
              ref={(el) => (cardsRef.current[i] = el)}
            >
              <div className="service-icon">{icons[key]}</div>
              <h3 className="service-title">{t(`services.${key}.title`)}</h3>
              <p className="service-desc">{t(`services.${key}.desc`)}</p>
              <ul className="service-list">
                {t(`services.${key}.items`)?.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
