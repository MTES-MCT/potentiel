import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '@infra/sequelize/helpers'
import { ProjectGFUploaded } from '@modules/project'
import { GarantiesFinancières } from '../garantiesFinancières.model'
import { models } from '../../../models'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import onProjectGFUploaded from './onProjectGFUploaded'

describe(`handler onProjectGFUploaded pour la projection garantiesFinancières`, () => {
  beforeEach(async () => {
    await resetDatabase()
  })
  const id = new UniqueEntityID().toString()
  const projetId = new UniqueEntityID().toString()
  const occurredAt = new Date('2022-01-04')
  const gfDate = new Date('2020-01-01')
  const fichierId = new UniqueEntityID().toString()
  const envoyéesPar = new UniqueEntityID().toString()
  const dateExpiration = new Date('2020-01-01')

  const évènement = new ProjectGFUploaded({
    payload: {
      projectId: projetId,
      gfDate,
      fileId: fichierId,
      submittedBy: envoyéesPar,
      expirationDate: dateExpiration,
    },
    original: {
      version: 1,
      occurredAt,
    },
  })

  describe(`Mise à jour d'une ligne dans la projection`, () => {
    it(`Etant donné un projet existant dans la projection garantiesFinancières,
    lorsqu'un événement ProjectGFUploaded est émis pour ce projet,
    alors la ligne devrait être mise à jour avec le fichier et le statut 'validé'`, async () => {
      await GarantiesFinancières.create({
        id,
        projetId,
        statut: 'en attente',
        soumisesALaCandidature: true,
      })

      await onProjectGFUploaded(évènement)

      const GF = await GarantiesFinancières.findOne({ where: { projetId } })

      expect(GF).toMatchObject({
        id,
        soumisesALaCandidature: true,
        statut: 'validé',
        envoyéesPar,
        dateEchéance: dateExpiration,
        dateEnvoi: occurredAt,
        dateConstitution: gfDate,
      })
    })
  })

  describe(`Création d'une ligne dans la projection`, () => {
    it(`Etant donné un projet non présent dans la projection garantiesFinancières,
      lorsqu'un évènement ProjectGFUploaded est émis pour ce projet,
      alors une nouvelle ligne devrait être insérée dans la projection`, async () => {
      const { Project } = models
      const projet = makeFakeProject({
        id: projetId,
        appelOffreId: 'PPE2 - Bâtiment',
        periodeId: '2',
        familleId: '',
      })

      await Project.create(projet)

      await onProjectGFUploaded(évènement)

      const GF = await GarantiesFinancières.findOne({ where: { projetId } })

      expect(GF).toMatchObject({
        soumisesALaCandidature: true,
        statut: 'validé',
        envoyéesPar,
        dateEchéance: dateExpiration,
        dateEnvoi: occurredAt,
        dateConstitution: gfDate,
      })
    })
  })
})
