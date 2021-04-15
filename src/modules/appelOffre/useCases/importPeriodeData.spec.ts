import { DomainEvent, Repository, UniqueEntityID } from '../../../core/domain'
import { errAsync, okAsync } from '../../../core/utils'
import { makeUser } from '../../../entities'
import { UnwrapForTest } from '../../../types'
import { makeFakeAppelOffre } from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'
import { AppelOffre } from '../AppelOffre'
import {
  AppelOffreDoesNotExistError,
  MissingAppelOffreIdError,
  MissingPeriodeIdError,
} from '../errors'
import { makeImportPeriodeData } from './importPeriodeData'

describe('importPeriodeData use-case', () => {
  const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

  describe('when a data line represents an existing appel offre', () => {
    const fakeAppelOffre = makeFakeAppelOffre()

    const appelOffreRepo: Repository<AppelOffre> = {
      save: jest.fn(() => okAsync(null)),
      load: jest.fn(() => okAsync(fakeAppelOffre)),
    }

    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    }

    const importPeriodeData = makeImportPeriodeData({ appelOffreRepo, eventBus })

    it('should call updatePeriode on the appelOffre and save it', async () => {
      const res = await importPeriodeData({
        dataLines: [{ "Appel d'offres": 'appelOffreId', Période: 'periodeId', other: 'param' }],
        importedBy: user,
      })

      expect(res.isOk()).toBe(true)
      if (res.isErr()) return

      expect(appelOffreRepo.load).toHaveBeenCalledWith(new UniqueEntityID('appelOffreId'))

      expect(fakeAppelOffre.updatePeriode).toHaveBeenCalledWith({
        periodeId: 'periodeId',
        data: { other: 'param' },
        updatedBy: user,
      })

      expect(appelOffreRepo.save).toHaveBeenCalledWith(fakeAppelOffre)
    })
  })

  describe('when a data line is missing an appel offre id', () => {
    const appelOffreRepo: Repository<AppelOffre> = {
      save: jest.fn(),
      load: jest.fn(),
    }

    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    }

    const importPeriodeData = makeImportPeriodeData({ appelOffreRepo, eventBus })

    it('should return a AppelOffreDoesNotExistError', async () => {
      const res = await importPeriodeData({
        dataLines: [{ other: 'param' }],
        importedBy: user,
      })

      expect(res._unsafeUnwrapErr()[0]).toBeInstanceOf(MissingAppelOffreIdError)
      expect(res._unsafeUnwrapErr()[0]).toMatchObject({
        lineNumber: 1,
      })
    })
  })

  describe('when a data line is missing a periode id', () => {
    const appelOffreRepo: Repository<AppelOffre> = {
      save: jest.fn(),
      load: jest.fn(),
    }

    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    }

    const importPeriodeData = makeImportPeriodeData({ appelOffreRepo, eventBus })

    it('should return a AppelOffreDoesNotExistError', async () => {
      const res = await importPeriodeData({
        dataLines: [{ "Appel d'offres": 'appelOffreId', other: 'param' }],
        importedBy: user,
      })

      expect(res._unsafeUnwrapErr()[0]).toBeInstanceOf(MissingPeriodeIdError)
      expect(res._unsafeUnwrapErr()[0]).toMatchObject({
        lineNumber: 1,
      })
    })
  })

  describe('when a data line is for an unexisting appel offre', () => {
    const appelOffreRepo: Repository<AppelOffre> = {
      save: jest.fn(),
      load: jest.fn(() => errAsync(new EntityNotFoundError())),
    }

    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    }

    const importPeriodeData = makeImportPeriodeData({ appelOffreRepo, eventBus })

    it('should return a AppelOffreDoesNotExistError', async () => {
      const res = await importPeriodeData({
        dataLines: [{ "Appel d'offres": 'appelOffreId', Période: 'periodeId', other: 'param' }],
        importedBy: user,
      })

      expect(res._unsafeUnwrapErr()[0]).toBeInstanceOf(AppelOffreDoesNotExistError)
      expect(res._unsafeUnwrapErr()[0]).toMatchObject({
        lineNumber: 1,
        appelOffreId: 'appelOffreId',
      })
    })
  })
})
