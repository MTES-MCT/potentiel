import React from 'react'
import { formatDate } from 'src/helpers/formatDate'
import { dataId } from 'src/helpers/testId'
import { ProjectDataForSignalerDemandeDelaiPage } from 'src/modules/project/queries/GetProjectDataForSignalerDemandeDelaiPage'

type ProjectInfoProps = {
  project: ProjectDataForSignalerDemandeDelaiPage
  children?: React.ReactNode
}

export const ProjectInfo = ({ project, children }: ProjectInfoProps) => {
  return (
    <div
      className="text-quote"
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
      }}
    >
      <div {...dataId('modificationRequest-item-nomProjet')}>{project.nomProjet}</div>
      <div
        style={{
          fontStyle: 'italic',
          lineHeight: 'normal',
          fontSize: 12,
        }}
      >
        <div {...dataId('modificationRequest-item-nomCandidat')}>{project.nomCandidat}</div>
        <span {...dataId('modificationRequest-item-communeProjet')}>
          {project.communeProjet}
        </span>,{' '}
        <span {...dataId('modificationRequest-item-departementProjet')}>
          {project.departementProjet}
        </span>
        , <span {...dataId('modificationRequest-item-regionProjet')}>{project.regionProjet}</span>
      </div>
      <p className="m-0">
        Désigné le{' '}
        <span {...dataId('modificationRequest-item-designationDate')}>
          {formatDate(project.notifiedOn, 'DD/MM/YYYY')}
        </span>{' '}
        pour la période{' '}
        <span {...dataId('modificationRequest-item-periode')}>
          {project.appelOffreId} {project.periodeId}
        </span>{' '}
        famille <span {...dataId('modificationRequest-item-famille')}>{project.familleId}</span>
      </p>
      {children}
    </div>
  )
}
