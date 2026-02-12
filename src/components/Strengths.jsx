import { useEffect, useRef } from 'react';
import { useLang } from '../context/LanguageContext';

export default function Strengths() {
  const { lang, t } = useLang();
  const itemsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    itemsRef.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const items = t('strengths.items');

  return (
    <section className="section" id="strengths">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Strengths</span>
          <h2 className="section-title">{t('strengths.title')}</h2>
        </div>
        <div className="strengths-grid">
          {items?.map((item, i) => (
            <div
              key={i}
              className="strength-item fade-in"
              ref={(el) => (itemsRef.current[i] = el)}
            >
              <div className="strength-number">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="strength-title">{item.title[lang]}</h3>
              <p>{item.desc[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
