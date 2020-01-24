import * as os from 'os';

const formatDuration = ms => {
  ms = Math.abs(ms);
  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
    millisecond: Math.floor(ms) % 1000,
  };
  return Object.entries(time)
    .filter(val => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
    .join(', ');
};

async function processHeathCheck(fn) {
  try {
    await fn();
    return 'OK';
  } catch (error) {
    return 'FAILED';
  }
}

export default function() {
  const healthcheck = {
    appVersion: process.env.APP_VERSION,
    uptime: formatDuration(process.uptime()),
    cpu: os.cpus().length,
    status: 'OK',
  };
  return healthcheck;
}
