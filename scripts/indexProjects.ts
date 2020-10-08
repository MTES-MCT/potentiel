import dotenv from 'dotenv'
import { initDatabase, projectRepo } from '../src/dataAccess'
dotenv.config()

initDatabase()
  .then(async () => {
    const projectList = await projectRepo.findAll(undefined, {
      pageSize: 1e6,
      page: 0,
    })

    return Promise.all(
      projectList.items.map((project) => projectRepo.index(project))
    )
  })
  .then((results) => {
    console.log('Done indexing all ' + results.length + ' projects')
    process.exit(0)
  })
  .catch((err) => {
    console.log('Caught error', err)
    process.exit(1)
  })
