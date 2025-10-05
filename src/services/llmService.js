const OpenAI = require('openai');
const logger = require('../utils/logger');
const config = require('../config/config');

class LLMService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.llm.apiKey
    });
  }

  async generateTechnicalContent(prompt) {
    try {
      logger.info('Gerando conteúdo técnico baseado em notícias...');
      
      const response = await this.openai.chat.completions.create({
        model: config.llm.model,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em criptomoedas e análise técnica. Crie tweets informativos e perspicazes sobre crypto.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 280,
        temperature: 0.7
      });

      const content = response.choices[0].message.content.trim();
      logger.info('Conteúdo gerado com sucesso');
      return content;
      
    } catch (error) {
      logger.error('Erro ao gerar conteúdo técnico:', error);
      throw error;
    }
  }
}

module.exports = LLMService;
