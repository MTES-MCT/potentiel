const { camelCase, pascalCase } = require('change-case')

module.exports = function (args) {
  const { queryName, projection } = args

  return `import models from '../../models'
import { resetDatabase } from '../../helpers'
import { ${camelCase(queryName)} } from './${camelCase(queryName)}'
import { UniqueEntityID } from '../../../../core/domain'

const { ${pascalCase(projection)} } = models

describe('Sequelize ${camelCase(queryName)}', () => {

  const itemId = new UniqueEntityID()

  beforeAll(async () => {
    await resetDatabase()

    await ${pascalCase(projection)}.bulkCreate([{ id: itemId }])
  })

  it('should return XYZ', async () => {
    const res = await ${camelCase(queryName)}()

    expect(res._unsafeUnwrap()).toMatchObject({})
  })
})`
}
