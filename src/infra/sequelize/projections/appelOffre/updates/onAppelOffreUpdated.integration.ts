import { UniqueEntityID } from '../../../../../core/domain'
import { AppelOffreUpdated } from '../../../../../modules/appelOffre/events'
import { describeProjector } from '../../../__tests__/projections'
import models from '../../../models'
import { onAppelOffreUpdated } from './onAppelOffreUpdated'

const { AppelOffre } = models

const appelOffreId = new UniqueEntityID().toString()

describeProjector(onAppelOffreUpdated)
  .onEvent(
    new AppelOffreUpdated({
      payload: {
        appelOffreId,
        updatedBy: '',
        delta: {
          param1: 'value1',
          param2: 'newvalue2',
        },
      },
    })
  )
  .shouldUpdate({
    model: AppelOffre,
    id: appelOffreId,
    before: {
      id: appelOffreId,
      data: { param2: 'value2', param3: 'value3' },
    },
    after: {
      data: {
        param1: 'value1',
        param2: 'newvalue2',
        param3: 'value3',
      },
    },
  })
