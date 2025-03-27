import { LogEntry } from 'winston';
import TransportStream, { TransportStreamOptions } from 'winston-transport';

export class MattermostTransport extends TransportStream {
  #webhookUrl?: string;
  constructor(opts: TransportStreamOptions = {}) {
    super(opts);

    const { MATTERMOST_MONITORING_WEBHOOK } = process.env;
    if (MATTERMOST_MONITORING_WEBHOOK) {
      this.#webhookUrl = MATTERMOST_MONITORING_WEBHOOK;
    }
  }

  public log(info: LogEntry, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (!this.#webhookUrl) return callback();
    if (this.silent) return callback();

    const message = info.message as string | Error;
    const errorText = message instanceof Error ? message.message : message;

    const metaText = Object.entries(info.meta)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    const text = `${errorText} (${metaText})`;
    return fetch(this.#webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    }).then(callback);
  }
}
