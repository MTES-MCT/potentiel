import { UniqueEntityID } from '../../../../../core/domain'
import { AppelOffreCreated } from '@modules/appelOffre'
import { describeProjector } from '../../../__tests__/projections'
import models from '../../../models'
import { onAppelOffreCreated } from './onAppelOffreCreated'

const { AppelOffre } = models

const appelOffreId = new UniqueEntityID().toString()

describeProjector(onAppelOffreCreated)
  .onEvent(
    new AppelOffreCreated({
      payload: {
        appelOffreId,
        createdBy: '',
        data: {
          param1: 'value1',
          param2: 'value2',
        },
      },
    })
  )
  .shouldCreate({
    model: AppelOffre,
    id: appelOffreId,
    value: {
      data: {
        param1: 'value1',
        param2: 'value2',
      },
    },
  })
