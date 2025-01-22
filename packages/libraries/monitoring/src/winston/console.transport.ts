import winston from 'winston';

declare module 'logform' {
  interface TransformableInfo {
    meta: Record<string, unknown>;
  }
}

/**
 * We are currently using a custom formatter because we don't really have monitoring capabilities.
 * In the futur, we can switch to logstash if beta.gouv.fr setup something like ELK
 */
const customFormat = winston.format((info) => {
  if ('error' in info && info.error instanceof Error && info.error.cause) {
    info.meta.cause = String(info.error.cause);
  }
  const meta = Object.keys(info.meta)
    .map((k) => `{${k}=${JSON.stringify(info.meta[k])}}`)
    .join(' ');
  info.message = `${info.message} | Service(${info.service}) | Metadata(${meta})`;
  return info;
});

export const consoleTransport = (props?: typeof winston.transports.ConsoleTransportOptions) =>
  new winston.transports.Console({
    ...props,
    format: winston.format.combine(customFormat(), winston.format.cli()),
  });
