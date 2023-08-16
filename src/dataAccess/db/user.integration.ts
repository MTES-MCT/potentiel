import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { v4 as uuid } from 'uuid';
import { userRepo, resetDatabase } from '.';
import { UserDreal, User } from '../../infra/sequelize/projectionsNext';

describe('userRepo sequelizeInstance', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  describe('addToDreal', () => {
    const userId = uuid();
    beforeAll(async () => {
      await User.create({
        id: userId,
        fullName: '',
        email: '',
        role: 'dreal',
      });
    });

    it('should add the dreal to the user', async () => {
      await userRepo.addToDreal(userId, 'Corse');

      const userDreals = await UserDreal.findAll({ where: { userId } });

      expect(userDreals).toHaveLength(1);
      //@ts-ignore
      expect(userDreals[0].dreal).toEqual('Corse');
    });
  });

  describe('findUsersForDreal', () => {
    const userId = uuid();

    it('return the users associated to the dreal', async () => {
      await User.create({
        id: userId,
        fullName: 'fullName',
        email: 'email@test.test',
        role: 'dreal',
      });

      await UserDreal.create({
        userId,
        dreal: 'Corse',
      });

      const drealUsers = await userRepo.findUsersForDreal('Corse');

      expect(drealUsers).toHaveLength(1);
      expect(drealUsers[0].fullName).toEqual('fullName');
      expect(drealUsers[0].email).toEqual('email@test.test');
      expect(drealUsers[0].role).toEqual('dreal');
    });
  });

  describe('findDrealsForUser', () => {
    const userId = uuid();

    it('return the dreals associated to the user', async () => {
      await User.create({
        id: userId,
        fullName: 'fullName',
        email: 'email@test.test',
        role: 'dreal',
      });

      await UserDreal.create({
        userId,
        dreal: 'Corse',
      });

      const dreals = await userRepo.findDrealsForUser(userId);

      expect(dreals).toHaveLength(1);
      expect(dreals[0]).toEqual('Corse');
    });
  });
});
