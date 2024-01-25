// Arhivo para que los tests tomen las variables de entorno del .env.test
import { config } from 'dotenv';

config({
  path: '.env.test',
});
