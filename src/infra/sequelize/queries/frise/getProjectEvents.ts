import { wrapInfra } from '../../../../core/utils'
import { GetProjectEvents, ProjectEventDTO } from '../../../../modules/frise'
import { ProjectEvent } from '../../projectionsNext'

export const getProjectEvents: GetProjectEvents = ({ projectId, user }) => {
  return wrapInfra(ProjectEvent.findAll({ where: { projectId } })).map((rawEvents) => {
    return {
      events: rawEvents
        .map((item) => item.get())
        .reduce((events, { type, valueDate }) => {
          if (
            (['admin', 'dgec', 'dreal', 'porteur-projet', 'acheteur-obligé'].includes(user.role) &&
              type === 'ProjectNotified') ||
            (['dgec', 'admin'].includes(user.role) && type === 'ProjectImported')
          ) {
            events.push({
              type,
              date: valueDate,
              variant: user.role,
            } as ProjectEventDTO)
          }

          return events
        }, []),
    }
  })
}
