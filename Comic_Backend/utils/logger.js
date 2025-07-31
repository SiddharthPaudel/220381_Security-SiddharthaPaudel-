import { createLogger, format, transports } from 'winston';
import 'winston-mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

// Needed to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// You can store this in your .env file too
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/Comic';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json()
  ),
  transports: [
    // Console log (for development/debugging)
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),

    // File log
    new transports.File({
      filename: path.join(__dirname, '../logs/audit.log'),
      level: 'info'
    }),

    // MongoDB log
    new transports.MongoDB({
      db: mongoURI,
      collection: 'audit_logs',
      level: 'info',
      options: { useUnifiedTopology: true },
      tryReconnect: true,
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    })
  ]
});

export default logger;
