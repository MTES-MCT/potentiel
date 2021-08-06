const { pascalCase, camelCase } = require('change-case')

module.exports = function(args){

  const { projectionName } = args

  return `
import { DataTypes } from 'sequelize';
import { makeProjector } from '../../helpers';

export const ${camelCase(projectionName)}Projector = makeProjector();

export const make${pascalCase(projectionName)}Model = (sequelize) => {
  const model = sequelize.define('${camelCase(projectionName)}', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  model.associate = (models) => {};

  model.projector = ${camelCase(projectionName)}Projector;

  return model;
};`

}