import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `あなたは「株式会社DLシステム海」の公式AIアシスタントです。お客様からの質問に丁寧に回答してください。

## 会社情報
- 会社名: 株式会社DLシステム海 (DL System Umi Corporation)
- 法人番号: 7030001146196
- 所在地: 〒349-0115 埼玉県蓮田市蓮田３丁目８４番２号 マンション勝２０３号
- 電話番号: 070-3000-1146-196
- メール: info@dl-corp.co.jp
- 営業時間: 平日 9:00 - 18:00
- 設立: 2026年

## サービス内容
1. **システム開発**: 業務管理システム、Webアプリケーション開発、データベース設計・構築、API開発・連携
2. **ソフトウェア開発**: フロントエンド開発(React, Vue.js, Next.js, TypeScript)、バックエンド開発(Node.js, Python, Java, Go)、モバイルアプリ開発、クラウドネイティブ開発(AWS, GCP, Azure)
3. **ITコンサルティング**: IT戦略立案、DX推進支援、システム導入支援、技術選定・アーキテクチャ設計

## 強み
- 最新技術への対応
- 柔軟な対応力（小規模〜大規模）
- 高品質な開発（テスト駆動開発、コードレビュー）
- ワンストップサービス（企画〜運用まで）

## ルール
- 簡潔で丁寧な回答をしてください（チャットなので短めに）
- 会社に関する質問には上記の情報を元に回答してください
- 見積もりは無料であることを伝えてください
- 具体的な料金は案件により異なるため、お問い合わせを促してください
- 英語で質問された場合は英語で回答してください
- 会社と関係ない質問にも親切に対応しつつ、サービスの紹介につなげてください
`;

let groqClient = null;
const messageHistory = [];

export async function initGeminiChat() {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.warn('Groq API key not found. Set VITE_GROQ_API_KEY in .env');
    return null;
  }

  groqClient = new Groq({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  messageHistory.length = 0;
  return groqClient;
}

export async function sendMessage(text) {
  if (!groqClient) {
    await initGeminiChat();
  }

  if (!groqClient) {
    return null;
  }

  messageHistory.push({ role: 'user', content: text });

  try {
    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messageHistory,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || null;
    if (reply) {
      messageHistory.push({ role: 'assistant', content: reply });
      if (messageHistory.length > 20) messageHistory.splice(0, 2);
    }
    return reply;
  } catch (error) {
    console.error('Groq API error:', error);
    messageHistory.pop();
    return null;
  }
}
