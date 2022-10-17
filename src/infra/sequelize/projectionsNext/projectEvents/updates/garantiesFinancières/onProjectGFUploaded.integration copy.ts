import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '@infra/sequelize/helpers'
import { ProjectGFUploaded, ProjectGFUploadedPayload } from '@modules/project'
import models from '../../../../models'
import { ProjectEvent } from '../../projectEvent.model'
import onProjectGFUploaded from './onProjectGFUploaded'

describe('Handler onProjectGFUploaded', () => {
  const { File, User } = models
  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const occurredAt = new Date('2022-01-04')
  const userId = new UniqueEntityID().toString()
  const gfDate = new Date('2021-12-26')
  const filename = 'my-file'
  const expirationDate = new Date('2025-01-01')
  const id = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  describe(`Cas où n'y a pas encore d'élément GF correspondant dans ProjectEvent`, () => {
    it(`Alors un nouvel élément devrait GF être inséré dans ProjectEvent avec le statut 'uploaded'`, async () => {
      await File.create({
        id: fileId,
        filename,
        designation: 'designation',
      })

      await User.create({
        id: userId,
        role: 'porteur-projet',
        email: 'email',
        fullName: 'name',
      })

      await onProjectGFUploaded(
        new ProjectGFUploaded({
          payload: {
            projectId,
            fileId,
            submittedBy: userId,
            gfDate,
            expirationDate,
          } as ProjectGFUploadedPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({
        where: { type: 'GarantiesFinancières', projectId },
      })

      expect(projectEvent).toMatchObject({
        type: 'GarantiesFinancières',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: {
          statut: 'uploaded',
          fichier: { id: fileId, name: filename },
          dateConstitution: gfDate.getTime(),
          dateExpiration: expirationDate.getTime(),
          initiéParRole: 'porteur-projet',
        },
      })
    })
  })

  describe(`Cas où il y a un élément GF avec le statut 'due' dans ProjectEvent`, () => {
    it(`Alors il devrait être mis à jour avec le fichier envoyé`, async () => {
      await File.create({
        id: fileId,
        filename,
        designation: 'designation',
      })

      await User.create({
        id: userId,
        role: 'porteur-projet',
        email: 'email',
        fullName: 'name',
      })

      await ProjectEvent.create({
        id,
        type: 'GarantiesFinancières',
        projectId,
        valueDate: new Date('2020-01-01').getTime(),
        eventPublishedAt: new Date('2020-01-01').getTime(),
        payload: { statut: 'due' },
      })

      await onProjectGFUploaded(
        new ProjectGFUploaded({
          payload: {
            projectId,
            fileId,
            submittedBy: userId,
            gfDate,
            expirationDate,
          } as ProjectGFUploadedPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({
        where: { type: 'GarantiesFinancières', projectId },
      })

      expect(projectEvent).toMatchObject({
        id,
        type: 'GarantiesFinancières',
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: {
          statut: 'uploaded',
          fichier: { id: fileId, name: filename },
          dateConstitution: gfDate.getTime(),
          dateExpiration: expirationDate.getTime(),
          initiéParRole: 'porteur-projet',
        },
      })
    })
  })
})
