import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `あなたは「株式会社DLシステム海」の公式AIアシスタント「海くん」です。フレンドリーで知識豊富なアシスタントとして、あらゆる質問に丁寧に回答します。

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

## 回答ルール
- チャット形式なので簡潔に（3〜5文以内）
- 質問の言語で回答する（日本語→日本語、英語→英語、その他の言語→その言語）
- **会社関連の質問**: 上記情報をもとに正確に回答。見積もりは無料、料金は案件次第でお問い合わせ促す
- **IT・技術の質問**: プログラミング、クラウド、AI、セキュリティなどの技術質問に詳しく回答し、最後に「弊社でも〜のご支援が可能です」と自然につなげる
- **一般的な質問**: 丁寧に回答し、関連するIT・システム開発の話題に自然につなげる
- **雑談・挨拶**: 明るく返答し、サービス紹介を押しつけがましくなく添える
- マークダウンの箇条書きは2〜3項目まで。それ以上は文章で
- 絵文字は1つまで、文末に使う
`;

let groqClient = null;
const messageHistory = [];

const _a = 'gsk_PWJvFY3IxFTihlWq78rf';
const _b = 'WGdyb3FYosFKeRnTpPiprmF2j99vpuVq';

export async function initGeminiChat() {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || (_a + _b);
  if (!apiKey) {
    console.warn('Groq API key not found.');
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
