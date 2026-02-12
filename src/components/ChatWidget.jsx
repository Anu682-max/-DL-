import { useState, useRef, useEffect, useMemo } from 'react';
import { useLang } from '../context/LanguageContext';
import { sendMessage as sendGemini, initGeminiChat } from '../services/gemini';
import { sanitizeHTML, sanitizeInput, createRateLimiter, hasSuspiciousContent } from '../utils/security';

const knowledge = {
  ja: {
    greeting: 'こんにちは！株式会社DLシステム海のAIアシスタントです。ご質問やご相談がございましたらお気軽にどうぞ。',
    quickButtons: ['サービスについて', '会社情報', 'お問い合わせ方法', '料金について'],
    responses: {
      services: {
        keywords: ['サービス', '何ができる', 'できること', '業務', '開発'],
        answer: '株式会社DLシステム海では以下のサービスを提供しています：\n\n<b>1. システム開発</b> - 業務管理システム、Webアプリ、DB設計、API開発\n\n<b>2. ソフトウェア開発</b> - フロントエンド、バックエンド、モバイルアプリ、クラウド\n\n<b>3. ITコンサルティング</b> - IT戦略、DX推進、システム導入支援',
      },
      company: {
        keywords: ['会社', '情報', '概要', '場所', '住所', 'どこ', '所在地'],
        answer: '株式会社DLシステム海の会社情報です：\n\n📍 <b>所在地</b>: 〒349-0115 埼玉県蓮田市蓮田３丁目８４番２号 マンション勝２０３号\n📞 <b>電話</b>: 070-3000-1146-196\n📧 <b>メール</b>: info@dl-corp.co.jp\n🕐 <b>営業時間</b>: 平日 9:00 - 18:00',
      },
      contact: {
        keywords: ['問い合わせ', '連絡', '相談', 'メール', '電話'],
        answer: 'お問い合わせは以下の方法で承っております：\n\n📧 <b>メール</b>: info@dl-corp.co.jp\n📞 <b>電話</b>: 070-3000-1146-196\n\nお見積もりは無料です。お気軽にご相談ください！',
      },
      price: {
        keywords: ['料金', '費用', '価格', '見積', 'いくら', 'コスト'],
        answer: 'お見積もりは無料で承っております。プロジェクトの規模や内容に応じて最適な料金プランをご提案いたします。\n\nまずはお気軽にご相談ください。',
      },
      tech: {
        keywords: ['技術', 'テクノロジー', 'プログラミング', '言語', 'フレームワーク', 'React', 'Python'],
        answer: '最新の技術スタックを活用した開発を行っています：\n\n💻 <b>フロントエンド</b>: React, Vue.js, Next.js, TypeScript\n⚙️ <b>バックエンド</b>: Node.js, Python, Java, Go\n☁️ <b>クラウド</b>: AWS, GCP, Azure\n🗄️ <b>データベース</b>: PostgreSQL, MySQL, MongoDB',
      },
      hours: {
        keywords: ['営業時間', '時間', '何時', 'いつ', '休み'],
        answer: '営業時間は<b>平日 9:00 - 18:00</b>です。\n\n土日祝日はお休みですが、メールは24時間受付中です。\n📧 info@dl-corp.co.jp',
      },
      thanks: {
        keywords: ['ありがとう', 'サンキュー', '助かり', '感謝'],
        answer: 'こちらこそありがとうございます！他にご質問がございましたらいつでもお聞きください。😊',
      },
      hello: {
        keywords: ['こんにちは', 'はじめまして', 'おはよう', 'こんばんは'],
        answer: 'こんにちは！株式会社DLシステム海へようこそ。何かお手伝いできることはありますか？',
      },
    },
    fallback: '申し訳ございません。そのご質問にはお答えできかねます。\n\n具体的なご相談はお電話（070-3000-1146-196）またはメール（info@dl-corp.co.jp）でお問い合わせください。',
  },
  en: {
    greeting: "Hello! I'm the DL System Umi AI Assistant. Feel free to ask me anything about our services.",
    quickButtons: ['About Services', 'Company Info', 'How to Contact', 'Pricing'],
    responses: {
      services: {
        keywords: ['service', 'what do you', 'offer', 'develop', 'build'],
        answer: 'DL System Umi offers:\n\n<b>1. System Development</b> - Business systems, Web apps, DB design, API development\n\n<b>2. Software Development</b> - Frontend, Backend, Mobile apps, Cloud-native\n\n<b>3. IT Consulting</b> - IT strategy, DX promotion, System implementation',
      },
      company: {
        keywords: ['company', 'info', 'about', 'location', 'address', 'where'],
        answer: 'DL System Umi Corporation:\n\n📍 <b>Address</b>: 3-84-2 Hasuda, Hasuda City, Saitama, Mansion Katsu #203\n📞 <b>Phone</b>: 070-3000-1146-196\n📧 <b>Email</b>: info@dl-corp.co.jp\n🕐 <b>Hours</b>: Weekdays 9:00 - 18:00',
      },
      contact: {
        keywords: ['contact', 'reach', 'email', 'phone', 'call'],
        answer: 'You can reach us through:\n\n📧 <b>Email</b>: info@dl-corp.co.jp\n📞 <b>Phone</b>: 070-3000-1146-196\n\nFree estimates available!',
      },
      price: {
        keywords: ['price', 'cost', 'pricing', 'estimate', 'how much', 'fee'],
        answer: "We provide free estimates tailored to your project's scope and requirements. Please reach out to discuss your project.",
      },
      tech: {
        keywords: ['technology', 'tech', 'programming', 'language', 'framework', 'stack'],
        answer: 'We use cutting-edge technology:\n\n💻 <b>Frontend</b>: React, Vue.js, Next.js, TypeScript\n⚙️ <b>Backend</b>: Node.js, Python, Java, Go\n☁️ <b>Cloud</b>: AWS, GCP, Azure\n🗄️ <b>Database</b>: PostgreSQL, MySQL, MongoDB',
      },
      hours: {
        keywords: ['hours', 'time', 'when', 'open', 'close'],
        answer: 'Business hours: <b>Weekdays 9:00 - 18:00</b> (JST).\n\nEmail inquiries accepted 24/7.\n📧 info@dl-corp.co.jp',
      },
      thanks: {
        keywords: ['thank', 'thanks', 'appreciate'],
        answer: "You're welcome! Feel free to ask anytime. 😊",
      },
      hello: {
        keywords: ['hello', 'hi', 'hey', 'good morning'],
        answer: 'Hello! Welcome to DL System Umi. How can I help you today?',
      },
    },
    fallback: "I'm sorry, I couldn't find an answer to that.\n\nPlease call us at 070-3000-1146-196 or email info@dl-corp.co.jp for specific inquiries.",
  },
};

function getResponse(text, lang) {
  const kb = knowledge[lang];
  const lower = text.toLowerCase();
  for (const key of Object.keys(kb.responses)) {
    if (kb.responses[key].keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return kb.responses[key].answer;
    }
  }
  return kb.fallback;
}

export default function ChatWidget() {
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const messagesEndRef = useRef(null);
  const chatLimiter = useMemo(() => createRateLimiter(10, 60000), []); // 10 messages per minute

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, typing]);

  const [geminiReady, setGeminiReady] = useState(false);
  const prevLangRef = useRef(lang);

  useEffect(() => {
    initGeminiChat().then((session) => {
      if (session) setGeminiReady(true);
    });
  }, []);

  // Reset chat when language changes
  useEffect(() => {
    if (prevLangRef.current !== lang) {
      prevLangRef.current = lang;
      if (hasGreeted) {
        const kb = knowledge[lang];
        setMessages([
          { sender: 'bot', text: kb.greeting },
          { sender: 'bot', quickButtons: kb.quickButtons },
        ]);
      }
    }
  }, [lang, hasGreeted]);

  const askAI = async (text) => {
    setTyping(true);
    const langHint = lang === 'en' ? '\n(Please reply in English)' : '';
    try {
      const aiResponse = await sendGemini(text + langHint);
      if (aiResponse) {
        setTyping(false);
        setMessages((prev) => [...prev, { sender: 'bot', text: aiResponse }]);
        return;
      }
    } catch (e) {
      console.error('Gemini error, using fallback:', e);
    }
    // Fallback to local responses
    setTyping(false);
    setMessages((prev) => [...prev, { sender: 'bot', text: getResponse(text, lang) }]);
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!hasGreeted) {
      setHasGreeted(true);
      const kb = knowledge[lang];
      setMessages([{ sender: 'bot', text: kb.greeting }]);
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: 'bot', quickButtons: kb.quickButtons }]);
      }, 500);
    }
  };

  const handleSend = () => {
    const raw = input.trim();
    if (!raw) return;
    if (raw.length > 500) {
      setInput(raw.slice(0, 500));
      return;
    }
    // Rate limiting
    if (!chatLimiter.canProceed()) {
      setRateLimited(true);
      const wait = Math.ceil(chatLimiter.getTimeUntilReset() / 1000);
      setMessages((prev) => [...prev, {
        sender: 'bot',
        text: lang === 'ja'
          ? `メッセージの送信頻度が高すぎます。${wait}秒後にお試しください。`
          : `Too many messages. Please wait ${wait} seconds.`,
      }]);
      setTimeout(() => setRateLimited(false), chatLimiter.getTimeUntilReset());
      return;
    }
    // Suspicious content check
    if (hasSuspiciousContent(raw)) {
      setMessages((prev) => [...prev,
        { sender: 'user', text: sanitizeInput(raw) },
        { sender: 'bot', text: lang === 'ja' ? '不正な入力が検出されました。' : 'Invalid input detected.' },
      ]);
      setInput('');
      return;
    }
    chatLimiter.record();
    const text = sanitizeInput(raw);
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');
    askAI(text);
  };

  const handleQuickBtn = (label) => {
    setMessages((prev) => [...prev, { sender: 'user', text: label }]);
    askAI(label);
  };

  return (
    <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">DL</div>
            <div>
              <h4>{lang === 'ja' ? 'DL アシスタント' : 'DL Assistant'}</h4>
              <span className="chat-status">{lang === 'ja' ? 'オンライン' : 'Online'}</span>
            </div>
          </div>
          <button className="chat-close" onClick={() => setIsOpen(false)} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => {
            if (msg.quickButtons) {
              return (
                <div key={i} className="chat-msg bot">
                  <div className="chat-msg-avatar">DL</div>
                  <div className="chat-msg-bubble">
                    <div className="chat-quick-btns">
                      {msg.quickButtons.map((label, j) => (
                        <button key={j} className="chat-quick-btn" onClick={() => handleQuickBtn(label)}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={i} className={`chat-msg ${msg.sender}`}>
                <div className="chat-msg-avatar">{msg.sender === 'bot' ? 'DL' : '👤'}</div>
                <div
                  className="chat-msg-bubble"
                  dangerouslySetInnerHTML={{ __html: msg.sender === 'user' ? sanitizeInput(msg.text) : sanitizeHTML(msg.text) }}
                />
              </div>
            );
          })}
          {typing && (
            <div className="chat-msg bot">
              <div className="chat-msg-avatar">DL</div>
              <div className="chat-msg-bubble">
                <div className="chat-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            maxLength={500}
            placeholder={lang === 'ja' ? 'メッセージを入力...' : 'Type a message...'}
          />
          <button className="chat-send" onClick={handleSend} aria-label="Send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      <button
        className="chat-toggle"
        onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
        aria-label="Chat"
      >
        <svg className="chat-icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <svg className="chat-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
