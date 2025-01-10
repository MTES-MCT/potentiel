// RFC5424 from higher to lower level
export const levels = ['error', 'warn', 'info', 'debug'] as const;

export type Level = (typeof levels)[number];
export const getLevel = (): Level => {
  const level = process.env.LOGGER_LEVEL ?? '';

  if (isLoggerLevel(level)) {
    return level;
  }

  return 'error';
};

const isLoggerLevel = (value: string): value is Level => {
  return levels.includes(value as Level);
};
