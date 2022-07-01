import { AppelOffre } from '@entities'
import React from 'react'
import { formatDate } from '../../helpers/formatDate'
import { dataId } from '../../helpers/testId'
import routes from '@routes'

type ProjectInfoProps = {
  project: {
    id: string
    nomProjet: string
    nomCandidat: string
    communeProjet: string
    regionProjet: string
    departementProjet: string
    periodeId: string
    familleId: string | undefined
    notifiedOn: number
    appelOffreId: string
    numeroGestionnaire?: string
    puissance?: number
    appelOffre?: AppelOffre
    unitePuissance?: string
  }
  children?: React.ReactNode
  className?: string
}

export const ProjectInfo = ({ project, children, className = '' }: ProjectInfoProps) => {
  const {
    id,
    nomProjet,
    nomCandidat,
    communeProjet,
    regionProjet,
    departementProjet,
    periodeId,
    familleId,
    notifiedOn,
    appelOffreId,
    numeroGestionnaire,
    puissance,
    appelOffre,
    unitePuissance,
  } = project
  const displayPuissance = puissance && (appelOffre || unitePuissance)
  return (
    <div
      className={`${className} p-4 bg-gray-100 border-solid border-l-4 border-y-0 border-r-0 border-blue-france-main-525-base`}
    >
      <div {...dataId('modificationRequest-item-nomProjet')}>
        <a href={routes.PROJECT_DETAILS(id)}>{nomProjet}</a>
      </div>
      <div
        style={{
          fontStyle: 'italic',
          lineHeight: 'normal',
          fontSize: 12,
        }}
      >
        <span {...dataId('modificationRequest-item-nomCandidat')}>{nomCandidat}</span>
        <br />
        <span {...dataId('modificationRequest-item-communeProjet')}>{communeProjet}</span>,{' '}
        <span {...dataId('modificationRequest-item-departementProjet')}>{departementProjet}</span>,{' '}
        <span {...dataId('modificationRequest-item-regionProjet')}>{regionProjet}</span>
      </div>
      {displayPuissance && (
        <div {...dataId('modificationRequest-item-puissance')}>
          {puissance} {appelOffre?.unitePuissance || unitePuissance}
        </div>
      )}
      <p className="m-0">
        Désigné le{' '}
        <span {...dataId('modificationRequest-item-designationDate')}>
          {formatDate(notifiedOn, 'DD/MM/YYYY')}
        </span>{' '}
        pour la période{' '}
        <span {...dataId('modificationRequest-item-periode')}>
          {appelOffreId} {periodeId}
        </span>{' '}
        {familleId && (
          <span {...dataId('modificationRequest-item-famille')}>famille {familleId}</span>
        )}
      </p>
      {numeroGestionnaire && <div>Identifiant gestionnaire de réseau : {numeroGestionnaire}</div>}
      {children}
    </div>
  )
}
