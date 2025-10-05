require('dotenv').config();

const config = {
  twitter: {
    // API Credentials
    bearerToken: process.env.TWITTER_BEARER_TOKEN,
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    // TwitterAPI.io (Alternativa)
    apiioKey: process.env.TWITTER_APIIO_KEY,
  },
  
  brave: {
    apiKey: process.env.BRAVE_API_KEY,
    searchUrl: process.env.BRAVE_SEARCH_URL || 'https://api.search.brave.com/res/v1/news/search',
  },
  
  llm: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
  },
  
  bot: {
    totalTweetsPerDay: parseInt(process.env.TOTAL_TWEETS_PER_DAY) || 9,
    technicalTweets: parseInt(process.env.TECHNICAL_TWEETS) || 4,
    memeTweets: parseInt(process.env.MEME_TWEETS) || 2,
    postingSchedule: process.env.POSTING_SCHEDULE || '0 8,10,12,14,16,18,20,22,23 * * *',
  },
  
  bot: {
    headless: process.env.HEADLESS_MODE === 'true',
    browserTimeout: parseInt(process.env.BROWSER_TIMEOUT) || 30000,
    loginRetryAttempts: parseInt(process.env.LOGIN_RETRY_ATTEMPTS) || 3,
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/bot.log',
  },
  
  crypto: {
    keywords: [
      'bitcoin', 'ethereum', 'crypto', 'blockchain', 'defi', 'nft',
      'altcoin', 'trading', 'hodl', 'bullrun', 'bearmarket', 'mining',
      'btc', 'eth', 'ada', 'sol', 'matic', 'avax', 'dot', 'link'
    ],
    newsSources: [
      'coindesk.com', 'cointelegraph.com', 'decrypt.co', 'theblock.co',
      'cryptonews.com', 'bitcoinmagazine.com', 'crypto.com'
    ]
  }
};

module.exports = config;
