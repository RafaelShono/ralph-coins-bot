const cron = require('node-cron');

console.log('=== TESTE DO AGENDADOR ===');
console.log('Data/hora atual:', new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

// Testar se o cron está funcionando
const testSchedule = '*/1 * * * *'; // A cada minuto

console.log('Agendando teste para executar a cada minuto...');

cron.schedule(testSchedule, () => {
  console.log('✅ Agendador funcionando! Hora:', new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
}, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});

console.log('Agendador iniciado. Aguarde 2 minutos para ver os logs...');

// Manter o processo ativo
setTimeout(() => {
  console.log('Teste concluído!');
  process.exit(0);
}, 120000); // 2 minutos
