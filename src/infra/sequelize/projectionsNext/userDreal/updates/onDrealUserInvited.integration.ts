import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../../core/domain';
import onDrealUserInvited from './onDrealUserInvited';
import { DrealUserInvited } from '../../../../../modules/authZ';
import { resetDatabase } from '../../../helpers';
import { UserDreal } from "../..";

const userId = new UniqueEntityID().toString();
describe('userDreal.onDrealUserInvited', () => {
  beforeEach(resetDatabase);

  it('should create the user dreal link', async () => {
    await onDrealUserInvited(
      new DrealUserInvited({
        payload: {
          userId,
          region: 'Bretagne',
          invitedBy: '',
        },
      }),
    );
    const result = await UserDreal.findOne({ where: { userId, dreal: 'Bretagne' } });
    expect(result).not.toEqual(null);
  });
});
