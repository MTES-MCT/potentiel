import { makeSequelizeProjector, SequelizeModel } from './makeSequelizeProjector'
export const withSequelizeProjector = (makeModel: () => SequelizeModel) => {
  const model = makeModel()

  model.projector = makeSequelizeProjector(model)

  return model
}
