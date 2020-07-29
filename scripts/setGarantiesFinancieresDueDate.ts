import { initDatabase, projectRepo } from '../src/dataAccess'
import { applyProjectUpdate } from '../src/entities'
import { asLiteral } from '../src/helpers/asLiteral'

initDatabase()
  .then(async () => {
    const projectList = await projectRepo.findAll(undefined, {
      pageSize: 1e6,
      page: 0,
    })

    return Promise.all(
      projectList.items.map((project) => {
        if (
          !project.garantiesFinancieresDueOn &&
          !!project.notifiedOn &&
          !!project.famille?.garantieFinanciereEnMois &&
          !!project.appelOffre?.periode?.canGenerateCertificate
        ) {
          const updatedProject = applyProjectUpdate({
            project,
            update: {
              garantiesFinancieresDueOn: 1598133600000, // 23 Août 2020
            },
            context: {
              userId: 'script',
              type: 'candidate-notification',
            },
          })

          if (!updatedProject) console.log('applyProjectUpdate returned null')

          return updatedProject && projectRepo.save(updatedProject)
        } else {
          // console.log(
          //   `Ignoring project ${project.nomProjet} with garantiesFinancieresDueOn=${project.garantiesFinancieresDueOn} garartiesFinanciereEnMois=${project.famille?.garantieFinanciereEnMois} and canGenerateCertificate=${project.appelOffre?.periode?.canGenerateCertificate}`
          // )
        }
      })
    )
  })
  .then((results) => {
    const updates = results.filter((item) => !!item && item.is_ok())
    console.log(
      updates.length +
        ' projects where successfully updated (on ' +
        results.length +
        ')'
    )
    process.exit(0)
  })
  .catch((err) => {
    console.log('Caught error', err)
    process.exit(1)
  })
