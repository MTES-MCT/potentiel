import models from '../../../models'
import { describeProjector, resetDatabase } from '../../../helpers'
import { onAppelOffreRemoved, onAppelOffreRemovedRemovePeriodes } from './onAppelOffreRemoved'
import { AppelOffreRemoved } from '../../../../../modules/appelOffre/events'
import { UniqueEntityID } from '../../../../../core/domain'

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
