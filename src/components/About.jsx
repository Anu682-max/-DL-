import { useEffect, useRef } from 'react';
import { useLang } from '../context/LanguageContext';

export default function About() {
  const { t } = useLang();
  const textRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    [textRef, infoRef].forEach((ref) => { if (ref.current) observer.observe(ref.current); });
    return () => observer.disconnect();
  }, []);

  const infoRows = [
    { label: t('about.companyName'), value: t('about.companyValue') },
    { label: t('about.corporateNumber'), value: '7030001146196' },
    { label: t('about.business'), value: t('about.businessValue') },
    { label: t('about.founded'), value: '2026年' },
    { label: t('about.ceo'), value: t('about.ceoValue') },
    { label: t('about.address'), value: t('about.addressValue'), multiline: true },
    { label: t('about.phone'), value: '070-3000-1146-196' },
  ];

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-header">
          <span className="section-label">About Us</span>
          <h2 className="section-title">{t('about.title')}</h2>
        </div>
        <div className="about-grid">
          <div className="about-text fade-in" ref={textRef}>
            <p className="about-lead">{t('about.lead')}</p>
            <p>{t('about.desc')}</p>
          </div>
          <div className="about-info fade-in" ref={infoRef}>
            <table className="info-table">
              <tbody>
                {infoRows.map((row, i) => (
                  <tr key={i}>
                    <th>{row.label}</th>
                    <td>
                      {row.multiline
                        ? row.value.split('\n').map((line, j) => <span key={j}>{line}{j === 0 && <br />}</span>)
                        : row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
