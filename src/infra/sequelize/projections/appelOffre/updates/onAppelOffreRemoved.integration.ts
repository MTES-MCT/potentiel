import { UniqueEntityID } from '../../../../../core/domain'
import { AppelOffreRemoved } from '@modules/appelOffre'
import { describeProjector } from '../../../__tests__/projections'
import models from '../../../models'
import { onAppelOffreRemoved, onAppelOffreRemovedRemovePeriodes } from './onAppelOffreRemoved'

const { AppelOffre, Periode } = models

const appelOffreId = new UniqueEntityID().toString()
const otherAppelOffreId = new UniqueEntityID().toString()
const periodeId = new UniqueEntityID().toString()

describeProjector(onAppelOffreRemoved)
  .onEvent(
    new AppelOffreRemoved({
      payload: {
        appelOffreId,
        removedBy: '',
      },
    })
  )
  .shouldDelete({
    model: AppelOffre,
    prior: [
      {
        id: appelOffreId,
        data: {},
      },
      {
        id: otherAppelOffreId,
        data: {},
      },
    ],
    remaining: [
      {
        id: otherAppelOffreId,
        data: {},
      },
    ],
  })

describeProjector(onAppelOffreRemovedRemovePeriodes)
  .onEvent(
    new AppelOffreRemoved({
      payload: {
        appelOffreId,
        removedBy: '',
      },
    })
  )
  .shouldDelete({
    model: Periode,
    prior: [
      {
        periodeId,
        appelOffreId,
        data: {},
      },
      {
        periodeId,
        appelOffreId: otherAppelOffreId,
        data: {},
      },
    ],
    remaining: [
      {
        periodeId,
        appelOffreId: otherAppelOffreId,
        data: {},
      },
    ],
  })
