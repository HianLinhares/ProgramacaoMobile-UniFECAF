// Taxa de câmbio (pode ser fixa ou buscar de uma API)
const EXCHANGE_RATE = 5.0; // 1 USD = 5 BRL (ajuste conforme necessário)

// Função para converter USD para BRL
export const usdToBrl = (usdAmount) => {
  return (usdAmount * EXCHANGE_RATE).toFixed(2);
};

// Função para formatar moeda brasileira
export const formatBrl = (amount) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Função combinada: converte USD para BRL e formata
export const usdToBrlFormatted = (usdAmount) => {
  const brlAmount = usdAmount * EXCHANGE_RATE;
  return formatBrl(brlAmount);
};