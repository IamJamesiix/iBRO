import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });


const config ={

 PORT: process.env.PORT,
 MONGO_URI: process.env.MONGO_URI,

 JWT_SECRET: process.env.JWT_SECRET,
 JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
 SMTP_USER: process.env.SMTP_USER,

 NODE_ENV: process.env.NODE_ENV,
 CLIENT_URL: process.env.CLIENT_URL,



 SENDGRID_API_KEY: process.env.SENDGRID_API_KEY



}
export default config
