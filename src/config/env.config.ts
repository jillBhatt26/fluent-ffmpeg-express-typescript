import 'dotenv/config';

const PORT = parseInt(process.env.PORT!) || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

export { NODE_ENV, PORT };
