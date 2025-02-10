import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const API_URL = process.env.API_URL || 'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt';

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Proxy Server is running...');
});

app.get('/api/exchange-rates', async (req: Request, res: Response) => {
  try {
    const response = await globalThis.fetch(API_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const text = await response.text();
    const parsedData = parseExchangeRates(text);

    res.json(parsedData);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

const parseExchangeRates = (data: string) => {
  const lines = data.split('\n').slice(2);

  return lines
    .filter((line) => line.trim() !== '')
    .map((line) => {
      const [country, currency, amount, code, rate] = line.split('|');

      return {
        country: country.trim(),
        currency: currency.trim(),
        amount: Number(amount),
        code: code.trim(),
        rate: Number(rate),
      };
    });
};

app.listen(PORT, () => {
  console.log(`🚀 Proxy Server is running on http://localhost:${PORT}`);
});
