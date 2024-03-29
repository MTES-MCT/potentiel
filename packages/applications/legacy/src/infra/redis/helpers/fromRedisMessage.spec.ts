import { describe, expect, it } from '@jest/globals';
import { fromRedisMessage } from './fromRedisMessage';
import { UserProjectsLinkedByContactEmail } from '../../../modules/authZ';
import { RedisMessage } from './RedisMessage';
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
    it('should return null', () => {
      const actual = fromRedisMessage({
        type: 'unknownEvent',
      } as RedisMessage);

      expect(actual).toBeNull();
    });
  });

  describe('when the message does not have a type', () => {
    it('should return null', () => {
      const actual = fromRedisMessage({} as RedisMessage);
      expect(actual).toBeNull();
    });
  });
});
