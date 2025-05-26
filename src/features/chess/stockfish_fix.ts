// src/features/chess/stockfish.ts
class StockfishManager {
  private worker: Worker | null = null;
  private isReady = false;
  private pendingCommands: string[] = [];

  async initialize(): Promise<Worker> {
    if (this.worker && this.isReady) {
      return this.worker;
    }

    this.worker = new Worker('/stockfish.js');
    this.isReady = false;
    this.pendingCommands = [];

    return new Promise((resolve) => {
      this.worker!.addEventListener('message', (event) => {
        const message = event.data;
        
        if (message === 'uciok') {
          this.sendCommand('isready');
        } else if (message === 'readyok') {
          this.isReady = true;
          // Envoyer les commandes en attente
          this.pendingCommands.forEach(cmd => this.worker!.postMessage(cmd));
          this.pendingCommands = [];
          resolve(this.worker!);
        }
      });

      this.worker!.postMessage('uci');
    });
  }

  sendCommand(command: string) {
    if (this.worker && this.isReady) {
      this.worker.postMessage(command);
    } else {
      this.pendingCommands.push(command);
    }
  }

  setMessageHandler(handler: (event: MessageEvent) => void) {
    if (this.worker) {
      // Nettoyer les anciens handlers
      this.worker.onmessage = null;
      this.worker.addEventListener('message', handler);
    }
  }

  removeMessageHandler(handler: (event: MessageEvent) => void) {
    if (this.worker) {
      this.worker.removeEventListener('message', handler);
    }
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;
    }
  }
}

const stockfishManager = new StockfishManager();

export async function initializeStockfish(): Promise<Worker> {
  return stockfishManager.initialize();
}

export function sendStockfishCommand(command: string) {
  stockfishManager.sendCommand(command);
}

export function setStockfishMessageHandler(handler: (event: MessageEvent) => void) {
  stockfishManager.setMessageHandler(handler);
}

export function removeStockfishMessageHandler(handler: (event: MessageEvent) => void) {
  stockfishManager.removeMessageHandler(handler);
}