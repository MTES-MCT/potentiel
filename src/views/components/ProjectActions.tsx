import React from 'react'
import { dataId } from '../../helpers/testId'
import { UserRole } from '@modules/users'
import { ACTION_BY_ROLE } from './actions'
import { ChevronDownIcon, SecondaryButton } from './UI'
import { Link } from '@components'
import { ProjectAppelOffre } from '@entities'

interface Props {
  project: {
    id: string
    appelOffre: ProjectAppelOffre
    isClasse: boolean
    isAbandoned: boolean
    isLegacy: boolean
    notifiedOn?: Date
    certificateFile?: {
      id: string
      filename: string
    }
    email: string
    nomProjet: string
    garantiesFinancières?: {
      id: string
      statut: 'à traiter' | 'validé' | 'en attente'
    }
  }
  role: UserRole
}

export const ProjectActions = ({ project, role }: Props) => {
  if (!project || !role) return <></>
  const actions = ACTION_BY_ROLE[role]?.call(null, project)
  if (!actions || !actions.length) return <></>

  return (
    <div style={{ position: 'relative' }} {...dataId('project-actions')}>
      <SecondaryButton className="ml-4" {...dataId('action-menu-trigger')}>
        Actions <ChevronDownIcon className="ml-2" />
      </SecondaryButton>
      <ul className="list--action-menu" {...dataId('action-menu')}>
        {actions.map(({ title, actionId, projectId, link, disabled, isDownload }, actionIndex) => (
          <li key={'notif_' + projectId + '_' + actionIndex}>
            {disabled ? (
              <i>{title}</i>
            ) : (
              <Link
                href={link}
                download={isDownload}
                data-actionid={actionId}
                data-projectid={projectId}
                {...dataId('item-action')}
              >
                {title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
