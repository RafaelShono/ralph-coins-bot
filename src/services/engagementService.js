const axios = require('axios');
const crypto = require('crypto');
const logger = require('../utils/logger');
const config = require('../config/config');
const LLMService = require('./llmService');

class EngagementService {
  constructor() {
    this.consumerKey = config.twitter.apiKey;
    this.consumerSecret = config.twitter.apiSecret;
    this.accessToken = config.twitter.accessToken;
    this.accessTokenSecret = config.twitter.accessTokenSecret;
    this.bearerToken = config.twitter.bearerToken;
    this.baseUrl = 'https://api.x.com';
    this.llmService = new LLMService();
    
    // Perfis influentes de crypto para seguir e interagir
    this.cryptoInfluencers = [
      'VitalikButerin', 'elonmusk', 'naval', 'aantonop', 'APompliano',
      'cz_binance', 'justinsuntron', 'brian_armstrong', 'coinbase',
      'binance', 'ethereum', 'bitcoin', 'solana', 'avalancheavax',
      'chainlink', 'polygon', 'cardano', 'polkadot', 'algorand',
      'crypto', 'coindesk', 'cointelegraph', 'theblock', 'decryptmedia'
    ];
    
    // Hashtags de crypto para monitorar
    this.cryptoHashtags = [
      '#Bitcoin', '#BTC', '#Ethereum', '#ETH', '#Crypto', '#Cryptocurrency',
      '#DeFi', '#NFT', '#Web3', '#Blockchain', '#Solana', '#SOL',
      '#Cardano', '#ADA', '#Polygon', '#MATIC', '#Avalanche', '#AVAX',
      '#Chainlink', '#LINK', '#Polkadot', '#DOT', '#Algorand', '#ALGO',
      '#CryptoNews', '#CryptoAnalysis', '#CryptoMarket', '#CryptoUpdate'
    ];
    
    // Posts já respondidos (para evitar spam)
    this.repliedTweets = new Set();
  }

  generateOAuthSignature(method, url, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    const signingKey = `${encodeURIComponent(this.consumerSecret)}&${encodeURIComponent(this.accessTokenSecret)}`;
    
    const signature = crypto
      .createHmac('sha1', signingKey)
      .update(baseString)
      .digest('base64');
    
    return signature;
  }

  async makeAuthenticatedRequest(method, endpoint, params = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = crypto.randomBytes(16).toString('hex');
      
      const oauthParams = {
        oauth_consumer_key: this.consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: timestamp,
        oauth_token: this.accessToken,
        oauth_version: '1.0'
      };
      
      // Adicionar parâmetros da query string
      const allParams = { ...oauthParams, ...params };
      
      const signature = this.generateOAuthSignature(method, url, allParams);
      oauthParams.oauth_signature = signature;
      
      const authHeader = 'OAuth ' + Object.keys(oauthParams)
        .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
        .join(', ');
      
      const config = {
        method,
        url,
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      };
      
      if (method === 'GET' && Object.keys(params).length > 0) {
        config.params = params;
      } else if (method === 'POST') {
        config.data = params;
      }
      
      const response = await axios(config);
      return response.data;
      
    } catch (error) {
      logger.error('Erro na requisição autenticada:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }

  async searchCryptoPosts(query, count = 20) {
    try {
      logger.info(`Buscando posts sobre: ${query}`);
      
      const params = {
        query: query,
        max_results: count,
        'tweet.fields': 'created_at,author_id,public_metrics,context_annotations',
        'user.fields': 'username,name,verified,public_metrics',
        expansions: 'author_id'
      };
      
      const response = await this.makeAuthenticatedRequest('GET', '/2/tweets/search/recent', params);
      
      if (response.data && response.data.length > 0) {
        logger.info(`Encontrados ${response.data.length} posts sobre ${query}`);
        return response.data;
      }
      
      return [];
      
    } catch (error) {
      logger.error('Erro ao buscar posts:', error.message);
      return [];
    }
  }

  async getTrendingCryptoTopics() {
    try {
      logger.info('Buscando tópicos em tendência sobre crypto...');
      
      const trendingTopics = [];
      
      // Buscar por hashtags populares
      for (const hashtag of this.cryptoHashtags.slice(0, 5)) {
        const posts = await this.searchCryptoPosts(hashtag, 10);
        if (posts.length > 0) {
          trendingTopics.push({
            hashtag,
            posts: posts.length,
            sample: posts[0]
          });
        }
        
        // Aguardar para evitar rate limit
        await this.sleep(2000);
      }
      
      logger.info(`Encontrados ${trendingTopics.length} tópicos em tendência`);
      return trendingTopics;
      
    } catch (error) {
      logger.error('Erro ao buscar tópicos em tendência:', error.message);
      return [];
    }
  }

  async findPostsToReply() {
    try {
      logger.info('Procurando posts para responder...');
      
      const postsToReply = [];
      
      // Buscar posts de perfis influentes
      for (const influencer of this.cryptoInfluencers.slice(0, 3)) {
        const posts = await this.searchCryptoPosts(`from:${influencer}`, 5);
        
        for (const post of posts) {
          if (!this.repliedTweets.has(post.id) && 
              post.public_metrics?.reply_count < 50 && // Posts com poucas respostas
              post.public_metrics?.like_count > 10) { // Posts com engajamento
            postsToReply.push({
              ...post,
              influencer,
              priority: 'high'
            });
          }
        }
        
        await this.sleep(2000);
      }
      
      // Buscar posts com hashtags populares
      const trendingTopics = await this.getTrendingCryptoTopics();
      
      for (const topic of trendingTopics) {
        const posts = await this.searchCryptoPosts(topic.hashtag, 5);
        
        for (const post of posts) {
          if (!this.repliedTweets.has(post.id) && 
              post.public_metrics?.reply_count < 20 &&
              post.public_metrics?.like_count > 5) {
            postsToReply.push({
              ...post,
              hashtag: topic.hashtag,
              priority: 'medium'
            });
          }
        }
        
        await this.sleep(2000);
      }
      
      // Ordenar por prioridade e engajamento
      postsToReply.sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (b.priority === 'high' && a.priority !== 'high') return 1;
        return (b.public_metrics?.like_count || 0) - (a.public_metrics?.like_count || 0);
      });
      
      logger.info(`Encontrados ${postsToReply.length} posts para responder`);
      return postsToReply.slice(0, 10); // Limitar a 10 posts
      
    } catch (error) {
      logger.error('Erro ao encontrar posts para responder:', error.message);
      return [];
    }
  }

  async generateReply(tweet) {
    try {
      logger.info(`Gerando resposta para tweet: ${tweet.id}`);
      
      const prompt = `Você é Ralph Coins, um especialista em criptomoedas com personalidade única e insights valiosos.

Tweet original: "${tweet.text}"

Crie uma resposta que:
1. Seja relevante e adicione valor ao tópico
2. Demonstre conhecimento técnico quando apropriado
3. Seja concisa (máximo 280 caracteres)
4. Use tom profissional mas acessível
5. Inclua insights únicos do Ralph Coins
6. Use hashtags relevantes (máximo 2-3)
7. Pode incluir emojis moderadamente

Exemplos de respostas:
- Para análise técnica: "Interessante padrão! RSI oversold + volume spike = potencial bounce. Suporte em $X parece sólido 📊 #TechnicalAnalysis"
- Para notícias: "Esta parceria é game-changer! Adoção institucional acelerando. Ralph Coins vê potencial de 3x aqui 🚀 #CryptoAdoption"
- Para perguntas: "Ótima pergunta! Baseado na análise de on-chain, vejo acumulação institucional. Bullish para Q4 💪 #OnChain"

Responda de forma única e valiosa:`;

      const reply = await this.llmService.generateTechnicalContent(prompt);
      
      // Verificar se a resposta é válida
      if (reply && reply.length > 0 && reply.length <= 280) {
        return reply;
      }
      
      // Fallback para resposta genérica
      return this.generateFallbackReply(tweet);
      
    } catch (error) {
      logger.error('Erro ao gerar resposta:', error.message);
      return this.generateFallbackReply(tweet);
    }
  }

  generateFallbackReply(tweet) {
    const fallbackReplies = [
      "Interessante perspectiva! Ralph Coins concorda com a análise 📊 #CryptoInsights",
      "Boa observação! Mercado crypto sempre surpreendendo 🚀 #RalphCoins",
      "Ponto válido! Análise técnica confirma essa tendência 📈 #TechnicalAnalysis",
      "Excelente insight! Ralph Coins vê potencial aqui 💪 #CryptoMarket",
      "Concordo! Fundamentos sólidos para essa projeção 🔥 #CryptoFundamentals"
    ];
    
    return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  }

  async replyToTweet(tweetId, replyText) {
    try {
      logger.info(`Respondendo ao tweet ${tweetId}: ${replyText}`);
      
      // Usar o mesmo método de autenticação que funciona para posts
      const url = `${this.baseUrl}/2/tweets`;
      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = crypto.randomBytes(16).toString('hex');
      
      const oauthParams = {
        oauth_consumer_key: this.consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: timestamp,
        oauth_token: this.accessToken,
        oauth_version: '1.0'
      };
      
      const signature = this.generateOAuthSignature('POST', url, oauthParams);
      oauthParams.oauth_signature = signature;
      
      const authHeader = 'OAuth ' + Object.keys(oauthParams)
        .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
        .join(', ');
      
      const payload = {
        text: replyText,
        reply: {
          in_reply_to_tweet_id: tweetId
        }
      };
      
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data?.data?.id) {
        logger.info(`✅ Resposta postada com sucesso: ${response.data.data.id}`);
        this.repliedTweets.add(tweetId);
        return response.data.data;
      }
      
      throw new Error('Resposta não foi postada');
      
    } catch (error) {
      logger.error('Erro ao responder tweet:', error.message);
      throw error;
    }
  }

  async engageWithPosts(count = 5) {
    try {
      logger.info(`=== INICIANDO ENGAJAMENTO COM ${count} POSTS ===`);
      
      const postsToReply = await this.findPostsToReply();
      
      if (postsToReply.length === 0) {
        logger.info('Nenhum post encontrado para responder');
        return [];
      }
      
      const results = [];
      const postsToProcess = postsToReply.slice(0, count);
      
      for (let i = 0; i < postsToProcess.length; i++) {
        const post = postsToProcess[i];
        
        try {
          logger.info(`Processando post ${i + 1}/${postsToProcess.length}: ${post.id}`);
          
          // Gerar resposta
          const replyText = await this.generateReply(post);
          
          // Postar resposta
          const result = await this.replyToTweet(post.id, replyText);
          
          results.push({
            success: true,
            originalTweetId: post.id,
            replyId: result.id,
            replyText: replyText,
            influencer: post.influencer || 'unknown',
            hashtag: post.hashtag || 'none'
          });
          
          logger.info(`✅ Resposta ${i + 1} postada com sucesso`);
          
          // Aguardar entre respostas para evitar rate limit
          if (i < postsToProcess.length - 1) {
            logger.info('Aguardando 30 segundos antes da próxima resposta...');
            await this.sleep(30000);
          }
          
        } catch (error) {
          logger.error(`❌ Erro ao responder post ${i + 1}:`, error.message);
          results.push({
            success: false,
            originalTweetId: post.id,
            error: error.message
          });
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      logger.info(`✅ Engajamento concluído: ${successCount}/${postsToProcess.length} respostas postadas`);
      
      return results;
      
    } catch (error) {
      logger.error('Erro no engajamento:', error.message);
      throw error;
    }
  }

  async likeTweet(tweetId) {
    try {
      logger.info(`Curtindo tweet: ${tweetId}`);
      
      const params = {
        tweet_id: tweetId
      };
      
      const response = await this.makeAuthenticatedRequest('POST', '/2/users/me/likes', params);
      
      if (response.data?.liked) {
        logger.info(`✅ Tweet curtido: ${tweetId}`);
        return true;
      }
      
      return false;
      
    } catch (error) {
      logger.error('Erro ao curtir tweet:', error.message);
      return false;
    }
  }

  async retweet(tweetId) {
    try {
      logger.info(`Retweetando: ${tweetId}`);
      
      const params = {
        tweet_id: tweetId
      };
      
      const response = await this.makeAuthenticatedRequest('POST', '/2/users/me/retweets', params);
      
      if (response.data?.retweeted) {
        logger.info(`✅ Tweet retweetado: ${tweetId}`);
        return true;
      }
      
      return false;
      
    } catch (error) {
      logger.error('Erro ao retweetar:', error.message);
      return false;
    }
  }

  async followUser(userId) {
    try {
      logger.info(`Seguindo usuário: ${userId}`);
      
      const params = {
        target_user_id: userId
      };
      
      const response = await this.makeAuthenticatedRequest('POST', '/2/users/me/following', params);
      
      if (response.data?.following) {
        logger.info(`✅ Usuário seguido: ${userId}`);
        return true;
      }
      
      return false;
      
    } catch (error) {
      logger.error('Erro ao seguir usuário:', error.message);
      return false;
    }
  }

  async getEngagementStats() {
    try {
      const stats = {
        totalReplies: this.repliedTweets.size,
        influencers: this.cryptoInfluencers.length,
        hashtags: this.cryptoHashtags.length,
        lastEngagement: new Date().toISOString()
      };
      
      logger.info('Estatísticas de engajamento:', stats);
      return stats;
      
    } catch (error) {
      logger.error('Erro ao obter estatísticas:', error.message);
      return null;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = EngagementService;
