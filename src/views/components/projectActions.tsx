import React from 'react'
import { AppelOffre, Project } from '../../entities'
import { dataId } from '../../helpers/testId'

interface Props {
  project: Project
  appelOffre?: AppelOffre
  projectActions?: (
    project: Project,
    appelOffre?: AppelOffre
  ) => Array<{
    title: string
    link: string
    isDownload?: boolean
    actionId?: string
    projectId?: string
    disabled?: boolean
  }> | null
}

const ProjectActions = ({ project, appelOffre, projectActions }: Props) => {
  if (!project || !projectActions) {
    return <div />
  }

  const actions = projectActions(project, appelOffre)

  if (!actions || !actions.length) {
    return <div />
  }

  return (
    <div style={{ position: 'relative' }}>
      <img
        src="/images/icons/external/more.svg"
        height="12"
        width="12"
        style={{ cursor: 'pointer' }}
        tabIndex={0}
        className="list--action-trigger"
      />
      <ul className="list--action-menu">
        {actions.map(
          (
            { title, actionId, projectId, link, disabled, isDownload },
            actionIndex
          ) => (
            <li key={'notif_' + project.id + '_' + actionIndex}>
              {disabled ? (
                <i>{title}</i>
              ) : (
                <a
                  href={link}
                  download={isDownload}
                  data-actionid={actionId}
                  data-projectid={projectId}
                  {...dataId('projectList-item-action')}
                >
                  {title}
                </a>
              )}
            </li>
          )
        )}
      </ul>
    </div>
  )
}

export default ProjectActions
