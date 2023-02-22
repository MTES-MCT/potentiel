import { DataTypes } from 'sequelize';
import { UserRepo } from '..';
import { logger } from '@core/utils';
import { makeUser, Project, User } from '@entities';
import { mapExceptError } from '../../helpers/results';
import { Err, None, Ok, OptionAsync, ResultAsync, Some } from '../../types';
import CONFIG from '../config';
import isDbReady from './helpers/isDbReady';
import { UserDreal } from '@infra/sequelize/projectionsNext/userDreal';
import { Région } from '@modules/dreal/région';

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => ({
  ...item,
  fullName: item.fullName || '',
});
const serialize = (item) => item;

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
    findUsersForDreal,
    findDrealsForUser,
    addToDreal,
    insert,
    update,
    addProject,
    remove,
    hasProject,
    addUserToProjectsWithEmail,
    addProjectToUserWithEmail,
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
    await _isDbReady;

    try {
      const userInDb = await UserModel.findByPk(id, { raw: true });

      if (!userInDb) return None;

      const userInstance = makeUser(deserialize(userInDb));

      if (userInstance.isErr()) throw userInstance.unwrapErr();

      return Some(userInstance.unwrap());
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return None;
    }
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

  async function addProject(userId: User['id'], projectId: Project['id']): ResultAsync<null> {
    try {
      // Check if user already has access to this project
      const priorAccess = await hasProject(userId, projectId);
      if (priorAccess) return Ok(null);

      const userInstance = await UserModel.findByPk(userId);

      if (!userInstance) {
        throw new Error('Cannot find user to add project to');
      }

      const ProjectModel = sequelizeInstance.model('project');
      const projectInstance = await ProjectModel.findByPk(projectId);

      if (!projectInstance) {
        throw new Error('Cannot find project to be added to user');
      }

      await userInstance.addProject(projectInstance);
      return Ok(null);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return Err(error);
    }
  }

  async function addUserToProjectsWithEmail(
    userId: User['id'],
    email: Project['email'],
  ): ResultAsync<null> {
    try {
      const userInstance = await UserModel.findByPk(userId);

      if (!userInstance) {
        throw new Error('Cannot find user to add project to');
      }

      const ProjectModel = sequelizeInstance.model('project');
      const projectsWithEmail = await ProjectModel.findAll({ where: { email } });

      await userInstance.addProjects(projectsWithEmail);

      return Ok(null);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return Err(error);
    }
  }

  async function addProjectToUserWithEmail(
    projectId: Project['id'],
    email: Project['email'],
  ): ResultAsync<null> {
    try {
      const userInstance = await UserModel.findOne({ where: { email } });

      if (!userInstance) {
        // No user with that email, just ignore the command
        return Ok(null);
      }

      const ProjectModel = sequelizeInstance.model('project');
      const projectInstance = await ProjectModel.findByPk(projectId);

      if (!projectInstance) {
        throw new Error('Cannot find project to be added to user');
      }

      await userInstance.addProject(projectInstance);
      return Ok(null);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return Err(error);
    }
  }

  async function hasProject(userId: User['id'], projectId: Project['id']): Promise<boolean> {
    try {
      const userInstance = await UserModel.findByPk(userId);

      if (!userInstance) {
        throw new Error('Cannot find user');
      }

      const ProjectModel = sequelizeInstance.model('project');
      const projectInstance = await ProjectModel.findByPk(projectId);

      if (!projectInstance) {
        throw new Error('Cannot find project');
      }

      return await userInstance.hasProject(projectInstance);
    } catch (error) {
      if (CONFIG.logDbErrors) {
        logger.error(error);
        logger.info(userId, projectId);
      }
      return false;
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
