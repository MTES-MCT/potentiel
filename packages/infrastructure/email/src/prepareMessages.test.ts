import { describe, it } from 'node:test';

import { expect } from 'chai';

import { MailjetEmail, prepareMessages } from './prepareMessages';

const createRecipients = (count: number, prefix: string) =>
  new Array(count).fill(null).map((_, index) => ({
    Email: `${prefix}+${index}@example.com`,
  }));

describe('prepareMessages', () => {
  const baseMessage: MailjetEmail = {
    From: { Email: 'from@example.com', Name: 'From Name' },
    To: [],
    Cc: [],
    Bcc: [],
    TemplateID: 123,
    TemplateLanguage: true,
    Subject: 'Test Subject',
    Variables: {},
  };

  it('should return the message as is when within max recipients', () => {
    const message = {
      ...baseMessage,
      To: [{ Email: 'to@example.com', Name: 'To Name' }],
    };

    const result = prepareMessages(message, 5);
    expect(result).to.have.lengthOf(1);
    expect(result[0].To).to.deep.equal(message.To);
  });

  it('should return a single message when recipients equals max', () => {
    const message = {
      ...baseMessage,
      To: createRecipients(5, 'to'),
    };
    const result = prepareMessages(message, 5);
    expect(result).to.have.lengthOf(1);
    expect(result).to.deep.equal([message]);
  });

  it('should split messages when to recipients exceed max', () => {
    const message = {
      ...baseMessage,
      To: createRecipients(12, 'to'),
    };
    const result = prepareMessages(message, 5);
    expect(result).to.have.lengthOf(3);
    expect(result[0].To).to.have.lengthOf(5);
    expect(result[1].To).to.have.lengthOf(5);
    expect(result[2].To).to.have.lengthOf(2);
  });

  it('should split messages when sum of to and cc exceed max', () => {
    const message = {
      ...baseMessage,
      To: createRecipients(5, 'to'),
      Cc: [{ Email: 'to+cc@example.com' }],
    };
    const result = prepareMessages(message, 5);
    expect(result).to.have.lengthOf(2);

    expect(result[0].To).to.have.lengthOf(5);
    expect(result[0].Cc).to.have.lengthOf(0);

    expect(result[1].To).to.have.lengthOf(0);
    expect(result[1].Cc).to.have.lengthOf(1);

    expect(result.map((x) => x.To).flat()).to.deep.equal(message.To);
    expect(result.map((x) => x.Cc).flat()).to.deep.equal(message.Cc);
    expect(result.map((x) => x.Bcc).flat()).to.deep.equal(message.Bcc);
  });

  it('should split messages when sum of to, cc and bcc exceed max', () => {
    const message = {
      ...baseMessage,
      To: createRecipients(8, 'to'),
      Cc: createRecipients(13, 'to'),
      Bcc: createRecipients(7, 'to'),
    };
    const result = prepareMessages(message, 5);
    expect(result).to.have.lengthOf(6);

    expect(result[0].To).to.have.lengthOf(5);
    expect(result[0].Cc).to.have.lengthOf(0);
    expect(result[0].Bcc).to.have.lengthOf(0);

    expect(result[1].To).to.have.lengthOf(3);
    expect(result[1].Cc).to.have.lengthOf(2);
    expect(result[1].Bcc).to.have.lengthOf(0);

    expect(result[2].To).to.have.lengthOf(0);
    expect(result[2].Cc).to.have.lengthOf(5);
    expect(result[2].Bcc).to.have.lengthOf(0);

    expect(result[3].To).to.have.lengthOf(0);
    expect(result[3].Cc).to.have.lengthOf(5);
    expect(result[3].Bcc).to.have.lengthOf(0);

    expect(result[4].To).to.have.lengthOf(0);
    expect(result[4].Cc).to.have.lengthOf(1);
    expect(result[4].Bcc).to.have.lengthOf(4);

    expect(result[5].To).to.have.lengthOf(0);
    expect(result[5].Cc).to.have.lengthOf(0);
    expect(result[5].Bcc).to.have.lengthOf(3);

    expect(result.map((x) => x.To).flat()).to.deep.equal(message.To);
    expect(result.map((x) => x.Cc).flat()).to.deep.equal(message.Cc);
    expect(result.map((x) => x.Bcc).flat()).to.deep.equal(message.Bcc);
  });
});
