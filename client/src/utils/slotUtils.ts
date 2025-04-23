export interface WinningResult {
  symbol: string;
  count: number;
}

export const findWinningSymbol = (symbols: string[]): WinningResult | null => {
  if (symbols.length !== 5) {
    throw new Error('Массив должен содержать ровно 5 элементов');
  }

  const symbolCounts = new Map<string, number>();

  // Подсчитываем количество каждого символа
  symbols.forEach(symbol => {
    symbolCounts.set(symbol, (symbolCounts.get(symbol) || 0) + 1);
  });

  // Ищем символ, который встречается 3, 4 или 5 раз
  for (const [symbol, count] of symbolCounts.entries()) {
    if (count >= 3) {
      return { symbol, count };
    }
  }

  return null;
}; 