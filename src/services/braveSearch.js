const axios = require('axios');
const logger = require('../utils/logger');
const config = require('../config/config');

class BraveSearch {
  constructor() {
    this.apiKey = config.brave.apiKey;
    this.baseUrl = 'https://api.search.brave.com/res/v1/news/search';
  }

  async searchCryptoNews(query = '', limit = 10) {
    try {
      logger.info(`Buscando notícias de crypto: ${query || 'geral'}`);
      
      const searchQuery = query || this.generateRandomCryptoQuery();
      
      const response = await axios.get(this.baseUrl, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': this.apiKey
        },
        params: {
          q: `${searchQuery} crypto`,
          count: limit,
          country: 'us',
          search_lang: 'en',
          spellcheck: 1
        }
      });

      if (response.data && response.data.results) {
        const results = response.data.results;
        logger.info(`Encontradas ${results.length} notícias`);
        
        return this.processNewsResults(results);
      } else {
        logger.warn('Nenhuma notícia encontrada na resposta da API');
        logger.warn('Resposta da API:', JSON.stringify(response.data, null, 2));
        return [];
      }
      
    } catch (error) {
      logger.error('Erro ao buscar notícias no Brave Search:', error.message);
      
      if (error.response) {
        logger.error('Status:', error.response.status);
        logger.error('Data:', error.response.data);
      }
      
      throw error;
    }
  }

  generateRandomCryptoQuery() {
    const cryptoTerms = [
      'bitcoin', 'ethereum', 'crypto market', 'blockchain', 'defi',
      'nft', 'altcoin', 'trading', 'mining', 'hodl', 'bullrun',
      'bear market', 'crypto regulation', 'web3', 'metaverse'
    ];
    
    return cryptoTerms[Math.floor(Math.random() * cryptoTerms.length)];
  }

  processNewsResults(results) {
    return results.map(result => ({
      title: result.title,
      url: result.url,
      description: result.description,
      publishedDate: result.age,
      source: this.extractDomain(result.url),
      content: result.description,
      relevance: this.calculateRelevance(result)
    })).filter(news => news.relevance > 0.1);
  }

  extractDomain(url) {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (error) {
      return 'unknown';
    }
  }

  calculateRelevance(newsItem) {
    const cryptoKeywords = config.crypto.keywords;
    const text = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    
    let score = 0;
    cryptoKeywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });
    
    // Bonus para fontes conhecidas de crypto
    const knownSources = config.crypto.newsSources;
    if (knownSources.some(source => newsItem.url.includes(source))) {
      score += 2;
    }
    
    return Math.min(score / cryptoKeywords.length, 1);
  }

  async getLatestCryptoNews() {
    try {
      const news = await this.searchCryptoNews('', 15);
      
      // Filtrar e ordenar por relevância
      const relevantNews = news
        .filter(item => item.relevance > 0.1)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 10);
      
      logger.info(`Retornando ${relevantNews.length} notícias relevantes`);
      return relevantNews;
      
    } catch (error) {
      logger.error('Erro ao obter últimas notícias:', error);
      throw error;
    }
  }
}

module.exports = BraveSearch;
