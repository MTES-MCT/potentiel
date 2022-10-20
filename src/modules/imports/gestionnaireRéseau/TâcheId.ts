import { TâchesType } from '../../../infra/sequelize/projectionsNext/tâches/tâches.model'
import { UniqueEntityID } from '@core/domain'

export const formatTaskId = ({ date, type }: { date: number; type: TâchesType }) =>
  new UniqueEntityID(`${date}#${type}`)
