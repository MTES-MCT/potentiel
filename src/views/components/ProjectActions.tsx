import React from 'react'
import { dataId } from '../../helpers/testId'
import { UserRole } from '@modules/users'
import { ACTION_BY_ROLE } from './actions'
import { ChevronDownIcon, SecondaryButton } from './UI'

interface Props {
  project: {
    id: string
    isClasse: boolean
    isAbandoned: boolean
    isLegacy: boolean
    notifiedOn?: Date
    certificateFile?: {
      id: string
      filename: string
    }
    appelOffreId: string
    periodeId: string
    familleId: string | undefined
    numeroCRE: string
    email: string
    nomProjet: string
    gf?: {
      id: string
      status: 'à traiter' | 'validé'
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
              <a
                href={link}
                download={isDownload}
                data-actionid={actionId}
                data-projectid={projectId}
                {...dataId('item-action')}
              >
                {title}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
