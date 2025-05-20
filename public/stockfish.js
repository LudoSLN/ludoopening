// Stockfish WebAssembly worker
// The original implementation attempted to load a local copy of the Stockfish
// engine ("/stockfish-16.1.js"), but this file was missing from the repository
// which caused the worker to fail and the AI never returned a move. Instead we
// load Stockfish from a CDN.
importScripts('https://cdn.jsdelivr.net/npm/stockfish@16/stockfish.js');
