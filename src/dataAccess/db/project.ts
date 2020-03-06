import { DataTypes } from 'sequelize'

import isDbReady from './helpers/isDbReady'

import { ProjectRepo } from '../'
import { makeProject, Project } from '../../entities'

export default function makeProjectRepo({ sequelize }): ProjectRepo {
  const ProjectModel = sequelize.define('project', {
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
    },
    hasBeenNotified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findById,
    findAll,
    insertMany,
    update
  })

  async function findById({ id }): Promise<Project | null> {
    await _isDbReady

    const projectInDb = await ProjectModel.findByPk(id)
    return projectInDb && makeProject(projectInDb)
  }

  async function findAll(query?): Promise<Array<Project>> {
    await _isDbReady

    return (
      await ProjectModel.findAll(
        query
          ? {
              where: query
            }
          : {}
      )
    ).map(makeProject)
  }

  async function insertMany(projects: Array<Project>) {
    await _isDbReady

    console.log('projectRepo.insertMany', projects)

    await Promise.all(projects.map(project => ProjectModel.create(project)))
  }

  async function update(project: Project) {
    await _isDbReady

    if (!project.id) {
      if (!project.id) {
        throw new Error('Cannot update project that has no id')
      }
    }

    await ProjectModel.update(project, { where: { id: project.id } })
  }
}

export { makeProjectRepo }
