import { GoogleGenerativeAI } from '@google/generative-ai';

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

let chatSession = null;

export async function initGeminiChat() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Gemini API key not found. Set VITE_GEMINI_API_KEY in .env');
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  chatSession = model.startChat({
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 500,
    },
  });

  return chatSession;
}

export async function sendMessage(text, retries = 1) {
  if (!chatSession) {
    await initGeminiChat();
  }

  if (!chatSession) {
    return null; // API key not set, fallback to local responses
  }

  try {
    const result = await chatSession.sendMessage(text);
    return result.response.text();
  } catch (error) {
    // Retry once on 429 rate limit errors
    if (retries > 0 && error?.message?.includes('429')) {
      const delay = parseInt(error.message.match(/retry in ([\d.]+)s/i)?.[1] || '12') * 1000;
      console.warn(`Gemini rate limited. Retrying in ${delay / 1000}s...`);
      await new Promise((r) => setTimeout(r, delay));
      return sendMessage(text, retries - 1);
    }
    console.error('Gemini API error:', error);
    return null; // fallback to local responses on error
  }
}
