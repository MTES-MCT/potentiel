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
    numeroCRE: {
      type: DataTypes.STRING,
      allowNull: false
    },
    famille: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nomCandidat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nomProjet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    puissance: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    prixReference: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    evaluationCarbone: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    note: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    nomRepresentantLegal: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    adresseProjet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codePostalProjet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    communeProjet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departementProjet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    regionProjet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    classe: {
      type: DataTypes.STRING,
      allowNull: false
    },
    motifsElimination: {
      type: DataTypes.STRING,
      allowNull: true
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

    await Promise.all(projects.map(project => ProjectModel.create(project)))
  }
}

export { makeProjectRepo }
