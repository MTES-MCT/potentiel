import { TaskType } from '../../../infra/sequelize/projectionsNext/tasks/tasks.model'
import { UniqueEntityID } from '@core/domain'

export const formatTaskId = ({ date, type }: { date: number; type: TaskType }) =>
  new UniqueEntityID(`${date}#${type}`)
