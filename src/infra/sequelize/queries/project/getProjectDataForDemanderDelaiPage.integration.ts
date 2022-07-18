import { UniqueEntityID } from '@core/domain'

import makeFakeProject from '../../../../__tests__/fixtures/project'
import { getProjectDataForDemanderDelaiPage } from './getProjectDataForDemanderDelaiPage'

import models from '../../models'

import { resetDatabase } from '../../helpers'

const projectId = new UniqueEntityID().toString()
const projet = makeFakeProject({
  id: projectId,
})
const { Project } = models

console.log('PROJET', projet)

describe('Sequelize getProjectDataForDemanderDelaiPage', () => {
  describe('Quand la page de demande de délai est requêtée', () => {
    it('doit retourner un ProjectDataForDemanderDelaiPage dto', async () => {
      await resetDatabase()
      await Project.create(projet)

      const reponseProjet = (await getProjectDataForDemanderDelaiPage(projectId))._unsafeUnwrap()

      expect(reponseProjet).toMatchObject({})
    })
  })
})
