import { fromRedisMessage } from './fromRedisMessage';
import { UserProjectsLinkedByContactEmail } from '@modules/authZ';
import { RedisMessage } from './RedisMessage';
import { Event } from '@potentiel/pg-event-sourcing';

describe('fromRedisMessage', () => {
  it('should deserialize a domain event from a redis message', () => {
    const result = fromRedisMessage({
      type: UserProjectsLinkedByContactEmail.type,
      payload: { userId: '2', projectIds: ['1', '2', '3'] },
      occurredAt: 1234,
    });

    expect(result).toBeInstanceOf(UserProjectsLinkedByContactEmail);
    expect(result?.payload).toMatchObject({ userId: '2', projectIds: ['1', '2', '3'] });
    expect(result?.occurredAt).toEqual(new Date(1234));
  });

  describe('when the message type does not exist', () => {
    it('should throw an error', () => {
      expect(() =>
        fromRedisMessage({
          type: 'unknownEvent',
        } as RedisMessage),
      ).toThrow();
    });
  });

  describe('when the message does not have a type', () => {
    it('should throw an error', () => {
      expect(() => fromRedisMessage({} as RedisMessage)).toThrow();
    });
  });
});

describe(`fromRedisMessage - events du package @potentiel/core-domain`, () => {
  it(`Lorsque le message retourné par Redis provient d'un event stream
      Alors le message est converti en une instance de classe de type domain event
      Et "occurredAt" est défini à la date du jour
      `, () => {
    // Arrange
    const dateMiseEnService = new Date().toISOString();
    const streamId = 'raccordement#identifiant-projet';
    const type = 'DateMiseEnServiceTransmise';
    const createdAt = new Date().toISOString();
    const version = 1;
    const payload = {
      dateMiseEnService,
      référenceDossierRaccordement: 'ref-raccordement',
      identifiantProjet: 'identifiant-projet',
    };

    const event: Event = {
      type,
      payload,
      streamId,
      createdAt,
      version,
    };

    // Act
    const actual = fromRedisMessage(event);

    // Assert
    expect(actual).toMatchObject({
      type,
      payload: {
        ...payload,
        dateMiseEnService: new Date(dateMiseEnService),
        streamId,
      },
    });
  });
});
