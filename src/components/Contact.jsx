import { useState, useEffect, useRef, useMemo } from 'react';
import { useLang } from '../context/LanguageContext';
import { sanitizeInput, isValidEmail, createRateLimiter, validateLength, hasSuspiciousContent } from '../utils/security';

export default function Contact() {
  const { lang, t } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formBlocked, setFormBlocked] = useState(false);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const submitTimeRef = useRef(0);
  const formLimiter = useMemo(() => createRateLimiter(3, 300000), []); // 3 submissions per 5 min

  useEffect(() => {
    submitTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    [formRef, infoRef].forEach((ref) => { if (ref.current) observer.observe(ref.current); });
    return () => observer.disconnect();
  }, []);

  const validateForm = (data) => {
    const errs = {};
    const name = data.get('name')?.trim();
    const email = data.get('email')?.trim();
    const message = data.get('message')?.trim();

    if (!validateLength(name, 1, 100)) {
      errs.name = lang === 'ja' ? '名前を入力してください（100文字以内）' : 'Name is required (max 100 chars)';
    }
    if (!email || !isValidEmail(email)) {
      errs.email = lang === 'ja' ? '有効なメールアドレスを入力してください' : 'Please enter a valid email';
    }
    if (!validateLength(message, 10, 2000)) {
      errs.message = lang === 'ja' ? 'メッセージは10文字以上2000文字以内で入力してください' : 'Message must be 10-2000 characters';
    }

    // Check all fields for suspicious content
    for (const [, value] of data.entries()) {
      if (typeof value === 'string' && hasSuspiciousContent(value)) {
        errs.suspicious = lang === 'ja' ? '不正な入力が検出されました' : 'Invalid input detected';
        break;
      }
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Honeypot check - if hidden field is filled, it's a bot
    if (formData.get('website_url')) {
      // Silently pretend success for bots
      setSubmitted(true);
      return;
    }

    // Time-based bot detection - form filled too fast (< 3 seconds)
    if (Date.now() - submitTimeRef.current < 3000) {
      setSubmitted(true);
      return;
    }

    // Rate limiting
    if (!formLimiter.canProceed()) {
      setFormBlocked(true);
      setErrors({
        rate: lang === 'ja'
          ? '送信頻度が高すぎます。しばらくしてからお試しください。'
          : 'Too many submissions. Please try again later.',
      });
      return;
    }

    // Validate
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Sanitize all inputs before processing
    const sanitized = {
      name: sanitizeInput(formData.get('name')),
      company: sanitizeInput(formData.get('company') || ''),
      email: sanitizeInput(formData.get('email')),
      subject: sanitizeInput(formData.get('subject') || ''),
      message: sanitizeInput(formData.get('message')),
    };

    formLimiter.record();
    console.log('Form submitted (sanitized):', sanitized);
    setErrors({});
    setSubmitted(true);
  };

  return (
    <section className="section section-alt" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Contact</span>
          <h2 className="section-title">{t('contact.title')}</h2>
          <p className="section-desc">{t('contact.desc')}</p>
        </div>
        <div className="contact-grid">
          <div className="contact-form fade-in" ref={formRef}>
            {submitted ? (
              <div className="form-success show">
                <h3>{t('contact.successTitle')}</h3>
                <p>{t('contact.successMsg')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot - invisible to users, bots fill it */}
                <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                  <label htmlFor="website_url">Website</label>
                  <input type="text" id="website_url" name="website_url" tabIndex={-1} autoComplete="off" />
                </div>

                {errors.rate && <p className="form-error form-error-global">{errors.rate}</p>}
                {errors.suspicious && <p className="form-error form-error-global">{errors.suspicious}</p>}

                <div className="form-group">
                  <label htmlFor="name">{t('contact.name')} <span className="required">*</span></label>
                  <input type="text" id="name" name="name" required maxLength={100} placeholder={t('contact.namePh')} />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="company">{t('contact.company')}</label>
                  <input type="text" id="company" name="company" maxLength={100} placeholder={t('contact.companyPh')} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t('contact.email')} <span className="required">*</span></label>
                  <input type="email" id="email" name="email" required maxLength={254} placeholder="example@email.com" />
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="subject">{t('contact.subject')}</label>
                  <select id="subject" name="subject">
                    <option value="">{t('contact.subjectDefault')}</option>
                    <option value="system">{t('contact.subjectSystem')}</option>
                    <option value="software">{t('contact.subjectSoftware')}</option>
                    <option value="consulting">{t('contact.subjectConsulting')}</option>
                    <option value="other">{t('contact.subjectOther')}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">{t('contact.message')} <span className="required">*</span></label>
                  <textarea id="message" name="message" rows="6" required maxLength={2000} placeholder={t('contact.messagePh')}></textarea>
                  {errors.message && <p className="form-error">{errors.message}</p>}
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={formBlocked}>{t('contact.submit')}</button>
              </form>
            )}
          </div>
          <div className="contact-info fade-in" ref={infoRef}>
            <div className="contact-info-item">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h4>{t('contact.addressLabel')}</h4>
                <p>{t('contact.addressValue').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h4>{t('contact.emailLabel')}</h4>
                <p>info@dl-corp.co.jp</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div>
                <h4>{t('contact.phoneLabel')}</h4>
                <p>070-3000-1146-196</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <h4>{t('contact.hoursLabel')}</h4>
                <p>{t('contact.hoursValue')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
