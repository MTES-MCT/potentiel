import { UniqueEntityID } from '@core/domain';
import onDrealUserInvited from './onDrealUserInvited';
import { DrealUserInvited } from '@modules/authZ';
import { resetDatabase } from '../../../helpers';
import { UserDreal } from '../userDreal.model';

const userId = new UniqueEntityID().toString();
const region = 'Bretagne';

describe('userDreal.onDrealUserInvited', () => {
  beforeEach(resetDatabase);

  it('should create the user dreal link', async () => {
    await onDrealUserInvited(
      new DrealUserInvited({
        payload: {
          userId,
          region,
          invitedBy: '',
        },
      }),
    );
    const result = await UserDreal.findOne({ where: { userId, dreal: region } });
    expect(result).not.toBeNull();
  });

  it('should not create the user dreal link if already exists', async () => {
    await UserDreal.create({
      userId,
      dreal: region,
    });

    await onDrealUserInvited(
      new DrealUserInvited({
        payload: {
          userId,
          region,
          invitedBy: '',
        },
      }),
    );
    const result = await UserDreal.findAndCountAll({ where: { userId, dreal: region } });
    expect(result.count).toEqual(1);
    expect(result.rows.length).toEqual(1);
  });
});
