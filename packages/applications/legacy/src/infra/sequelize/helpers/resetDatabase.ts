import { sequelizeInstance } from '../../../sequelize.config';

export const resetDatabase = async () => {
  const { models } = sequelizeInstance;
  try {
    return await Promise.all(
      Object.keys(models).map((key: string) => {
        if (['sequelize', 'Sequelize'].includes(key)) return null;
        return models[key].destroy({ where: {}, force: true });
      }),
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};
