import { DataTypes } from 'sequelize'

import isDbReady from './helpers/isDbReady'

import { ProjectRepo } from '../'
import { makeProject, Project } from '../../entities'

export default function makeProjectRepo({ sequelize }): ProjectRepo {
  const ProjectModel = sequelize.define('Project', {
    periode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nomCandidat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    localisation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    puissance: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    prixUnitaire: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findAll,
    insertMany
  })

  async function findAll(): Promise<Array<Project>> {
    await _isDbReady

    return (await ProjectModel.findAll()).map(makeProject)
  }

  async function insertMany(projects: Array<Project>) {
    await _isDbReady

    await Promise.all(projects.map(ProjectModel.create))
  }
}

export { makeProjectRepo }
