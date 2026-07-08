import { defineConfig } from '@prisma/config';

// Carrega explicitamente as variáveis do arquivo .env para o ambiente
import 'dotenv/config';

export default defineConfig({
  datasource: {
    // @ts-ignore
    url: process.env.DATABASE_URL,
  },
});