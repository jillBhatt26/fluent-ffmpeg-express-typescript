import 'dotenv/config';

const PORT = parseInt(process.env.PORT!) || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL || '';
const SUPABASE_PROJECT_API_KEY = process.env.SUPABASE_PROJECT_API_KEY || '';

export { NODE_ENV, PORT, SUPABASE_PROJECT_API_KEY, SUPABASE_PROJECT_URL };
