type Level = 'error' | 'warn' | 'info' | 'debug';

const levelOrder: Record<Level, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const envLevel = (process.env.LOG_LEVEL as Level) || 'info';
const currentLevelRank = levelOrder[envLevel] ?? 2;

const log = (lvl: Level, ...args: any[]) => {
  if (levelOrder[lvl] <= currentLevelRank) {
    // eslint-disable-next-line no-console
    console[lvl === 'debug' ? 'log' : lvl](...args);
  }
};

export const logger = {
  error: (...a: any[]) => log('error', ...a),
  warn: (...a: any[]) => log('warn', ...a),
  info: (...a: any[]) => log('info', ...a),
  debug: (...a: any[]) => log('debug', ...a),
  level: envLevel,
};

export default logger;