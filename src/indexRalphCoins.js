const TwitterOAuthOfficial = require('./services/twitterOAuthOfficial');
const BraveSearch = require('./services/braveSearch');
const LLMService = require('./services/llmService');
const logger = require('./utils/logger');
const config = require('./config/config');

class RalphCoinsBot {
  constructor() {
    this.twitterService = new TwitterOAuthOfficial();
    this.braveSearch = new BraveSearch();
    this.llmService = new LLMService();
  }

  async initialize() {
    try {
      logger.info('=== INICIALIZANDO RALPH COINS BOT ===');
      
      await this.twitterService.initialize();
      
      logger.info('✅ Ralph Coins Bot inicializado com sucesso!');
      
    } catch (error) {
      logger.error('❌ Erro ao inicializar Ralph Coins Bot:', error.message);
      throw error;
    }
  }

  async postNow() {
    try {
      logger.info('=== POSTANDO TWEET RALPH COINS AGORA ===');
      
      // Gerar conteúdo específico do Ralph Coins baseado em notícias reais
      const content = await this.generateRalphCoinsContent();
      logger.info('Conteúdo gerado:', content);
      
      // Postar tweet
      const result = await this.twitterService.postTweet(content);
      
      logger.info('✅ Tweet Ralph Coins postado com sucesso!');
      logger.info('ID do tweet:', result.data?.id);
      logger.info('🔗 Link:', `https://twitter.com/Crypto_realtime/status/${result.data?.id}`);
      
      return result;
      
    } catch (error) {
      logger.error('❌ Erro ao postar tweet Ralph Coins:', error.message);
      throw error;
    }
  }

  async postBatch(count = 3) {
    try {
      logger.info(`=== POSTANDO LOTE DE ${count} TWEETS RALPH COINS ===`);
      
      const results = [];
      
      for (let i = 0; i < count; i++) {
        try {
          logger.info(`Postando tweet Ralph Coins ${i + 1}/${count}...`);
          
          const content = await this.generateRalphCoinsContent();
          const result = await this.twitterService.postTweet(content);
          
          results.push({
            success: true,
            id: result.data?.id,
            content: content
          });
          
          logger.info(`✅ Tweet ${i + 1} postado: ${result.data?.id}`);
          
          // Aguardar entre posts para evitar rate limit
          if (i < count - 1) {
            logger.info('Aguardando 30 segundos antes do próximo tweet...');
            await this.sleep(30000);
          }
          
        } catch (error) {
          logger.error(`❌ Erro no tweet Ralph Coins ${i + 1}:`, error.message);
          results.push({
            success: false,
            error: error.message
          });
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      logger.info(`✅ Lote Ralph Coins concluído: ${successCount}/${count} tweets postados com sucesso`);
      
      return results;
      
    } catch (error) {
      logger.error('❌ Erro no lote de tweets Ralph Coins:', error.message);
      throw error;
    }
  }

  async generateRalphCoinsContent() {
    const now = new Date();
    const timestamp = now.toLocaleString('pt-BR');
    
    try {
      // Buscar notícias reais
      logger.info('Buscando notícias reais via Brave Search...');
      const news = await this.braveSearch.getLatestCryptoNews();
      
      if (news && news.length > 0) {
        logger.info(`Encontradas ${news.length} notícias relevantes`);
        
        // Escolher uma notícia aleatória
        const selectedNews = news[Math.floor(Math.random() * news.length)];
        logger.info(`Notícia selecionada: ${selectedNews.title}`);
        
        // Personalidades específicas do Ralph Coins
        const personalities = [
          'technical',
          'market', 
          'news',
          'analysis',
          'insights'
        ];
        
        const personality = personalities[Math.floor(Math.random() * personalities.length)];
        logger.info(`Personalidade escolhida: ${personality}`);
        
        // Gerar conteúdo baseado na notícia real
        return await this.generateContentFromNews(selectedNews, personality, timestamp);
        
      } else {
        logger.warn('Nenhuma notícia encontrada, usando conteúdo padrão');
        return this.generateDefaultContent(timestamp);
      }
      
    } catch (error) {
      logger.error('Erro ao buscar notícias:', error.message);
      return this.generateDefaultContent(timestamp);
    }
  }

  async generateContentFromNews(news, personality, timestamp) {
    try {
      // Tentar usar LLM para gerar conteúdo baseado na notícia
      if (this.llmService && config.llm.apiKey) {
        logger.info('Gerando conteúdo com LLM baseado na notícia...');
        
        const basePrompt = `Você é um assistente especializado em criar posts de notícias sobre criptomoedas para Twitter/X. 
O objetivo é que cada post pareça escrito por um humano e seja curto, chamativo e informativo.

Regras:
1. Título da notícia resumido e impactante.
2. Resumo ou comentário rápido (1-2 frases) explicando a relevância da notícia.
3. Insight ou opinião leve, como um humano comentaria.
4. Fonte da notícia (link).
5. Hashtags relevantes (máx. 3-5), como #ETH #CryptoNews #RalphCoins.
6. Máximo de 280 caracteres.
7. Pode usar emojis de forma moderada, sem exageros.
8. Varie o estilo e vocabulário para não parecer robótico.

Exemplo de saída:
Ethereum News: ETH Bears 'Getting Slaughtered' as Price Hits $3,200 🐂  
Bulls are taking control after last week's dip. Could $3,500 be next?  
Full analysis: http://coindesk.com  
#ETH #CryptoNews #RalphCoins

Agora crie um post baseado nesta notícia: "${news.title}" - ${news.description}
Fonte: ${news.source}`;

        let prompt;
        switch (personality) {
          case 'technical':
            prompt = `${basePrompt}

Foque em análise técnica: indicadores, suportes, resistências, padrões gráficos. Use hashtags como #TechnicalAnalysis #RalphCoins`;
            break;
            
          case 'market':
            prompt = `${basePrompt}

Foque em análise de mercado: impacto no preço, tendências, correlações, sentiment. Use hashtags como #MarketAnalysis #RalphCoins`;
            break;
            
          case 'news':
            prompt = `${basePrompt}

Foque em notícias: resumo claro, contexto, importância. Use hashtags como #CryptoNews #RalphCoins`;
            break;
            
          case 'analysis':
            prompt = `${basePrompt}

Foque em análise profunda: insights exclusivos, implicações futuras, dados fundamentais. Use hashtags como #DeepAnalysis #RalphCoins`;
            break;
            
          case 'insights':
            prompt = `${basePrompt}

Foque em insights únicos: perspectiva diferenciada, inteligência de mercado, visão estratégica. Use hashtags como #CryptoInsights #RalphCoins`;
            break;
            
          default:
            prompt = `${basePrompt}

Foque em comentário geral: perspectiva Ralph Coins, observação inteligente. Use hashtags como #RalphCoins #Crypto`;
        }
        
        const llmContent = await this.llmService.generateTechnicalContent(prompt);
        if (llmContent && llmContent.length > 0) {
          return llmContent;
        }
      }
      
      // Fallback: gerar conteúdo manual baseado na notícia
      const content = this.generateManualContentFromNews(news, personality, timestamp);
      
      // Verificar tamanho do tweet
      if (content.length > 280) {
        logger.warn(`Tweet muito longo (${content.length} caracteres), encurtando...`);
        return content.substring(0, 277) + '...';
      }
      
      return content;
      
    } catch (error) {
      logger.error('Erro ao gerar conteúdo com LLM:', error.message);
      return this.generateManualContentFromNews(news, personality, timestamp);
    }
  }

  generateManualContentFromNews(news, personality, timestamp) {
    const source = news.source;
    const title = this.createImpactfulTitle(news.title);
    const crypto = this.extractCryptoFromTitle(news.title);
    
    switch (personality) {
      case 'technical':
        return `${crypto} Technical: ${title} 📊
${this.getTechnicalComment()}
${this.getTechnicalInsight()}
Read more: ${news.url}
#${crypto} #TechnicalAnalysis #RalphCoins`;

      case 'market':
        return `${crypto} Market: ${title} 📈
${this.getMarketComment()}
${this.getMarketImpact()}
Read more: ${news.url}
#${crypto} #MarketAnalysis #RalphCoins`;

      case 'news':
        return `${crypto} News: ${title} 📰
${this.getNewsComment()}
${this.getNewsContext()}
Read more: ${news.url}
#${crypto} #CryptoNews #RalphCoins`;

      case 'analysis':
        return `${crypto} Analysis: ${title} 🔍
${this.getAnalysisComment()}
${this.getAnalysisInsight()}
Read more: ${news.url}
#${crypto} #DeepAnalysis #RalphCoins`;

      case 'insights':
        return `${crypto} Insights: ${title} 💡
${this.getInsightComment()}
${this.getInsight()}
Read more: ${news.url}
#${crypto} #CryptoInsights #RalphCoins`;

      default:
        return `${crypto} Update: ${title} 🚀
${this.getGeneralComment()}
Ralph Coins perspective on this development.
Read more: ${news.url}
#${crypto} #RalphCoins #Crypto`;
    }
  }

  createImpactfulTitle(title) {
    // Criar título mais impactante e curto
    const shortTitle = title.length > 50 ? title.substring(0, 50) + '...' : title;
    
    // Adicionar emojis baseados no conteúdo
    if (title.toLowerCase().includes('bull') || title.toLowerCase().includes('pump')) {
      return `${shortTitle} 🐂`;
    } else if (title.toLowerCase().includes('bear') || title.toLowerCase().includes('crash')) {
      return `${shortTitle} 🐻`;
    } else if (title.toLowerCase().includes('ethereum') || title.toLowerCase().includes('eth')) {
      return `${shortTitle} ⬆️`;
    } else if (title.toLowerCase().includes('bitcoin') || title.toLowerCase().includes('btc')) {
      return `${shortTitle} ₿`;
    } else {
      return `${shortTitle} 📊`;
    }
  }

  extractCryptoFromTitle(title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('bitcoin') || titleLower.includes('btc')) return 'BTC';
    if (titleLower.includes('ethereum') || titleLower.includes('eth')) return 'ETH';
    if (titleLower.includes('solana') || titleLower.includes('sol')) return 'SOL';
    if (titleLower.includes('cardano') || titleLower.includes('ada')) return 'ADA';
    if (titleLower.includes('polygon') || titleLower.includes('matic')) return 'MATIC';
    if (titleLower.includes('avalanche') || titleLower.includes('avax')) return 'AVAX';
    if (titleLower.includes('polkadot') || titleLower.includes('dot')) return 'DOT';
    if (titleLower.includes('chainlink') || titleLower.includes('link')) return 'LINK';
    return 'Crypto';
  }

  getTechnicalComment() {
    const comments = [
      'Charts looking interesting here...',
      'Technical setup is getting spicy 🔥',
      'This could be the breakout we\'ve been waiting for',
      'Pattern forming looks promising',
      'Key levels being tested right now'
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  getMarketComment() {
    const comments = [
      'Market sentiment shifting fast',
      'This could move the needle significantly',
      'Big implications for the broader market',
      'Institutional interest picking up',
      'Retail FOMO might kick in soon'
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  getNewsComment() {
    const comments = [
      'This is huge for adoption',
      'Game changer for the ecosystem',
      'Regulatory clarity finally coming',
      'Partnership that could move markets',
      'Development that changes everything'
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  getAnalysisComment() {
    const comments = [
      'Deep dive reveals interesting patterns',
      'Data suggests we\'re at an inflection point',
      'Historical analysis shows this is significant',
      'Fundamental shift happening here',
      'This could redefine the narrative'
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  getInsightComment() {
    const comments = [
      'Ralph Coins sees this differently...',
      'My take: this is bigger than people think',
      'Smart money positioning for this',
      'Early movers will benefit most',
      'This validates our long-term thesis'
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  getTechnicalInsight() {
    const insights = [
      'RSI oversold, could bounce soon',
      'Support holding strong at key level',
      'Volume spike suggests real interest',
      'Breakout above resistance = moon',
      'MACD showing bullish divergence'
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  getMarketImpact() {
    const impacts = [
      'Could trigger a major rally',
      'Institutional FOMO incoming',
      'This changes the game completely',
      'Retail will follow the smart money',
      'Perfect storm brewing here'
    ];
    return impacts[Math.floor(Math.random() * impacts.length)];
  }

  getNewsContext() {
    const contexts = [
      'Massive implications for adoption',
      'This is the catalyst we needed',
      'Game-changing development',
      'Could spark the next bull run',
      'Institutional validation incoming'
    ];
    return contexts[Math.floor(Math.random() * contexts.length)];
  }

  getAnalysisInsight() {
    const insights = [
      'Long-term implications are huge',
      'Historical patterns suggest major move',
      'Fundamentals support this narrative',
      'Correlation with traditional markets breaking',
      'Market structure remains bullish'
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  getInsight() {
    const insights = [
      'Early positioning pays off here',
      'Smart money already accumulating',
      'This validates our thesis completely',
      'Long-term opportunity of a lifetime',
      'Institutional adoption accelerating fast'
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  getGeneralComment() {
    const comments = [
      'Ralph Coins sees massive potential here',
      'This is exactly what we expected',
      'Market evolution happening in real-time',
      'Fundamentals remain rock solid',
      'Crypto maturing faster than expected'
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  generateDefaultContent(timestamp) {
    const defaultTweets = [
      `🤖 Ralph Coins Bot - ${timestamp}

Bot funcionando perfeitamente!
Análise em tempo real do mercado crypto.
Ralph Coins sempre ativo!

#RalphCoins #CryptoBot #RealTime #Analysis`,

      `⚡ Ralph Coins Active - ${timestamp}

Ralph Coins sempre em movimento!
Mercado crypto em constante evolução.
Análise e insights em tempo real.

#RalphCoins #CryptoActive #RealTime #Insights`,

      `🚀 Ralph Coins Revolution - ${timestamp}

Revolução crypto em andamento!
Blockchain transformando o mundo.
Ralph Coins na vanguarda!

#RalphCoins #CryptoRevolution #Blockchain #Innovation`
    ];
    
    return defaultTweets[Math.floor(Math.random() * defaultTweets.length)];
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async startScheduler() {
    try {
      logger.info('=== INICIANDO AGENDADOR RALPH COINS ===');
      
      // Agendar 9 posts por dia distribuídos
      const schedules = [
        '0 8 * * *',   // 8:00 AM
        '0 10 * * *',  // 10:00 AM
        '0 12 * * *',  // 12:00 PM
        '0 14 * * *',  // 2:00 PM
        '0 16 * * *',  // 4:00 PM
        '0 18 * * *',  // 6:00 PM
        '0 20 * * *',  // 8:00 PM
        '0 22 * * *',  // 10:00 PM
        '0 23 * * *'   // 11:00 PM
      ];
      
      logger.info(`Agendando ${schedules.length} posts por dia`);
      
      // Usar node-cron para agendar
      const cron = require('node-cron');
      
      schedules.forEach((schedule, index) => {
        cron.schedule(schedule, async () => {
          try {
            logger.info(`⏰ Executando post agendado ${index + 1}/9...`);
            await this.postNow();
          } catch (error) {
            logger.error(`❌ Erro no post agendado ${index + 1}:`, error.message);
          }
        }, {
          scheduled: true,
          timezone: "America/Sao_Paulo"
        });
        
        logger.info(`✅ Post ${index + 1} agendado: ${schedule} (Brasil)`);
      });
      
      logger.info('✅ Agendador Ralph Coins iniciado com sucesso!');
      logger.info('📅 Posts agendados: 8h, 10h, 12h, 14h, 16h, 18h, 20h, 22h, 23h (Brasil)');
      logger.info('🕐 Hora atual do servidor:', new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
      logger.info('🌍 Timezone configurado: America/Sao_Paulo');
      
    } catch (error) {
      logger.error('❌ Erro ao iniciar agendador:', error.message);
      throw error;
    }
  }
}

// Executar baseado nos argumentos da linha de comando
async function main() {
  const bot = new RalphCoinsBot();
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'start':
        await bot.initialize();
        await bot.startScheduler();
        logger.info('🚀 Ralph Coins Bot iniciado com agendamento automático!');
        logger.info('📅 9 posts por dia: 8h, 10h, 12h, 14h, 16h, 18h, 20h, 22h, 23h');
        logger.info('⏰ Bot rodando continuamente... Pressione Ctrl+C para parar');
        
        // Manter o processo rodando
        process.on('SIGINT', () => {
          logger.info('🛑 Parando Ralph Coins Bot...');
          process.exit(0);
        });
        
        // Manter vivo
        setInterval(() => {
          // Heartbeat a cada 5 minutos
        }, 5 * 60 * 1000);
        break;
        
      case 'post-now':
        await bot.initialize();
        await bot.postNow();
        break;
        
      case 'post-batch':
        const count = parseInt(process.argv[3]) || 3;
        await bot.initialize();
        await bot.postBatch(count);
        break;
        
      case 'status':
        await bot.initialize();
        logger.info('✅ Ralph Coins Bot funcionando corretamente');
        break;
        
      default:
        // Se não especificar comando, iniciar automaticamente (para Render)
        logger.info('🚀 Iniciando Ralph Coins Bot automaticamente...');
        await bot.startScheduler();
        logger.info('🔄 Bot rodando continuamente... Pressione Ctrl+C para parar.');
        
        // Manter o processo rodando
        process.on('SIGINT', () => {
          logger.info('🛑 Parando Ralph Coins Bot...');
          process.exit(0);
        });
        
        // Manter vivo e abrir porta para o Render
        const express = require('express');
        const app = express();
        const PORT = process.env.PORT || 3000;
        
        app.get('/', (req, res) => {
          res.json({
            status: 'Ralph Coins Bot ativo',
            message: 'Bot rodando e postando automaticamente',
            nextPosts: '8h, 10h, 12h, 14h, 16h, 18h, 20h, 22h, 23h',
            timestamp: new Date().toISOString()
          });
        });
        
        app.get('/health', (req, res) => {
          res.json({ status: 'healthy', timestamp: new Date().toISOString() });
        });
        
        app.listen(PORT, () => {
          logger.info(`🌐 Bot rodando na porta ${PORT}`);
          logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
        });
        
        // Heartbeat a cada 5 minutos
        setInterval(() => {
          logger.info('💓 Bot ativo - próximo post agendado');
        }, 5 * 60 * 1000);
        break;
    }
  } catch (error) {
    logger.error('Erro na execução do Ralph Coins Bot:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = RalphCoinsBot;
