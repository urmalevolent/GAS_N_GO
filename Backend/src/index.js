import app from './app.js';
import dotenv from 'dotenv';
import { startRentalAutoCompleter } from './services/autoCompleter.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  GAS N GO Backend Server is Running!`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Mode: ${NODE_ENV}`);
  console.log(`  API URL: http://localhost:${PORT}/api`);
  console.log(`=========================================`);
  
  // Menjalankan auto-completer sewa kedaluwarsa secara background
  startRentalAutoCompleter();
});
