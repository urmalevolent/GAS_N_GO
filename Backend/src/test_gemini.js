import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing with API Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NONE');

const genAI = new GoogleGenerativeAI(apiKey || '');

async function runTest() {
  try {
    // Uji dengan apiVersion 'v1'
    console.log('Running test with apiVersion: v1...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' });
    const result = await model.generateContent('Say hello in 3 words.');
    console.log('[SUCCESS] v1 result:', result.response.text().trim());
  } catch (err) {
    console.error('[FAILED] v1 failed:', err.message);
    
    // Uji default (v1beta) sebagai komparasi
    try {
      console.log('\nRunning test with default apiVersion...');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent('Say hello in 3 words.');
      console.log('[SUCCESS] default result:', result.response.text().trim());
    } catch (err2) {
      console.error('[FAILED] default failed:', err2.message);
    }
  }
}

runTest();
