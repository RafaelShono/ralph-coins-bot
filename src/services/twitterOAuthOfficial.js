const axios = require('axios');
const crypto = require('crypto');
const logger = require('../utils/logger');
const config = require('../config/config');

class TwitterOAuthOfficial {
  constructor() {
    this.consumerKey = config.twitter.apiKey;
    this.consumerSecret = config.twitter.apiSecret;
    this.accessToken = config.twitter.accessToken;
    this.accessTokenSecret = config.twitter.accessTokenSecret;
    this.baseUrl = 'https://api.x.com';
  }

  async initialize() {
    try {
      logger.info('=== VERIFICANDO CREDENCIAIS ===');
      
      if (!this.consumerKey) {
        throw new Error('Consumer Key não configurado');
      }
      logger.info('Consumer Key configurado');
      
      if (!this.consumerSecret) {
        throw new Error('Consumer Secret não configurado');
      }
      logger.info('Consumer Secret configurado');
      
      if (!this.accessToken) {
        throw new Error('Access Token não configurado');
      }
      logger.info('Access Token configurado');
      
      if (!this.accessTokenSecret) {
        throw new Error('Access Token Secret não configurado');
      }
      logger.info('Access Token Secret configurado');
      
      logger.info('✅ Credenciais OAuth verificadas');
      
    } catch (error) {
      logger.error('❌ Erro ao verificar credenciais:', error.message);
      throw error;
    }
  }

  generateOAuthSignature(method, url, params) {
    // Criar string de parâmetros ordenados
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    logger.info('Parâmetros ordenados:', sortedParams);
    
    // Criar string base para assinatura
    const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    logger.info('String base da assinatura:', baseString);
    
    // Criar chave de assinatura
    const signingKey = `${encodeURIComponent(this.consumerSecret)}&${encodeURIComponent(this.accessTokenSecret)}`;
    logger.info('Chave de assinatura criada');
    
    // Gerar assinatura HMAC-SHA1
    const signature = crypto
      .createHmac('sha1', signingKey)
      .update(baseString)
      .digest('base64');
    
    logger.info('Assinatura gerada com sucesso');
    return signature;
  }

  async postTweet(text) {
    try {
      logger.info('=== POSTANDO TWEET VIA API V2 ===');
      logger.info('Texto do tweet:', text);
      
      const url = `${this.baseUrl}/2/tweets`;
      logger.info('URL da API v2:', url);
      
      // Parâmetros OAuth
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
      
      logger.info('Parâmetros OAuth:', oauthParams);
      
      // Gerar assinatura
      logger.info('Gerando assinatura OAuth...');
      const signature = this.generateOAuthSignature('POST', url, oauthParams);
      oauthParams.oauth_signature = signature;
      
      // Criar header de autorização
      const authHeader = 'OAuth ' + Object.keys(oauthParams)
        .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
        .join(', ');
      
      logger.info('Header de autorização:', authHeader);
      
      // Payload do tweet
      const payload = { text };
      logger.info('Payload do tweet:', payload);
      
      // Fazer requisição
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });
      
      logger.info('Tweet postado com sucesso!');
      logger.info('Resposta da API:', response.data);
      
      return response.data;
      
    } catch (error) {
      logger.error('Erro ao postar tweet:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }
}

module.exports = TwitterOAuthOfficial;
