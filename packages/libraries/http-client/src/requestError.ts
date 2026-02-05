import { Body } from './post.js';

export class RequestError extends Error {
  constructor(
    public context: {
      status: number;
      statusText: string;
      url: URL;
      method: 'GET' | 'POST';
      body?: Body;
    },
  ) {
    super('Request failed');
  }

  get iServerError() {
    return this.context.status >= 500 && this.context.status <= 599;
  }
}
