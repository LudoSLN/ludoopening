export function initializeStockfish(): Worker {
  const stockfish = new Worker('/stockfish.js');
  
  // Initialize UCI mode
  stockfish.postMessage('uci');
  stockfish.postMessage('isready');
  
  return stockfish;
}