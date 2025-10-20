import { DataTypes } from 'sequelize';
import { UserRepo } from '..';
import { logger } from '../../core/utils';
import { Project, User } from '../../entities';
import { mapExceptError } from '../../helpers/results';
import { Err, None, Ok, OptionAsync, ResultAsync, Some } from '../../types';
import CONFIG from '../config';
import isDbReady from './helpers/isDbReady';
import { UserDreal, UserProjects } from '../../infra/sequelize/projectionsNext';
import { Région } from '../../modules/dreal/région';

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => ({
  ...item,
  fullName: item.fullName || '',
});
const serialize = (item) => item;

/**
 * @deprecated
 */
export default function makeUserRepo({ sequelizeInstance }): UserRepo {
  const UserModel = sequelizeInstance.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registeredOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    keycloakId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    fonction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  const _isDbReady = isDbReady({ sequelizeInstance });

  return Object.freeze({
    findById,
    findAll,
    findDrealsForUser,
    addToDreal,
    insert,
    update,
    remove,
  });

  // findDrealsForUser: (userId: User['id']) => Promise<Array<Région>>
  // addToDreal: (userId: User['id'], dreal: Région) => ResultAsync<null>

  async function findUsersForDreal(dreal: string): Promise<Array<User>> {
    await _isDbReady;

    try {
      if (!dreal) return [];

      const drealUsersIds: string[] = (
        await UserDreal.findAll({
          where: { dreal },
        })
      ).map((item) => item.get().userId);

      if (!drealUsersIds.length) return [];

      const drealUsers: User[] = (
        await UserModel.findAll({
          where: { id: drealUsersIds },
        })
      )
        .map((item) => item.get())
        .map(deserialize);

      return drealUsers;
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return [];
    }
  }

  async function findDrealsForUser(userId: User['id']): Promise<Array<Région>> {
    await _isDbReady;

    try {
      const userDreals = await UserDreal.findAll({ where: { userId } });

      return userDreals.map((item) => item.dreal);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return [];
    }
  }

  async function addToDreal(userId: User['id'], dreal: Région): ResultAsync<null> {
    await _isDbReady;

    try {
      await UserDreal.create({ userId, dreal });

      return Ok(null);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return Err(error);
    }
  }

  async function findById(id: User['id']): OptionAsync<User> {
    const userInDb = await UserModel.findByPk(id, { raw: true });

    if (!userInDb) return None;
    return Some(userInDb);
  }

  async function findAll(query?: Record<string, any>): Promise<Array<User>> {
    await _isDbReady;

    try {
      const usersRaw = await UserModel.findAll(
        query
          ? {
              where: query,
            }
          : {},
      );

      const deserializedItems = mapExceptError(
        usersRaw.map((user) => user.get()),
        deserialize,
        'User.findAll.deserialize error',
      );

      return deserializedItems;
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return [];
    }
  }

  async function insert(user: User): ResultAsync<User> {
    await _isDbReady;

    try {
      await UserModel.create(serialize(user));
      return Ok(user);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return Err(error);
    }
  }

  async function update(user: User): ResultAsync<User> {
    await _isDbReady;

    try {
      await UserModel.update(serialize(user), {
        where: { id: user.id },
      });
      return Ok(user);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return Err(error);
    }
  }

  async function remove(id: User['id']): ResultAsync<null> {
    await _isDbReady;

    try {
      await UserModel.destroy({ where: { id } });
      return Ok(null);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return Err(error);
    }
  }
}

export { makeUserRepo };
