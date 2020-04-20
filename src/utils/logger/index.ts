import { createLogger, Logger, LoggerOptions, format } from 'winston';
const { combine, timestamp, splat, printf, errors, json } = format;

// Transports
import consoleTransport from './transports/console';

const logFormat =
  process.env.NODE_ENV === 'development'
    ? printf(({ level, message, stack, timestamp, errorCode = '' }) => {
        let log = `${timestamp} ${level} ${errorCode}: ${message}`;

        if (stack) {
          log = `${log}\n${stack}`;
        }
        return log;
      })
    : json();

const options: LoggerOptions = {
  format: combine(errors({ stack: true }), splat(), timestamp(), logFormat),
  level: 'info',
  transports: [consoleTransport],
  exitOnError: false,
};

const logger: Logger = createLogger(options);

export default logger;
