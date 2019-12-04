import { transports } from 'winston';

const options: transports.ConsoleTransportOptions = {
  handleExceptions: true,
};

export default new transports.Console(options);
