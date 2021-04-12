import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest'
import ROUTES from '../../../../routes'

interface ProjectDetailsProps {
  modificationRequest: ModificationRequestPageDTO
}

export const ProjectDetails = ({ modificationRequest: { project } }: ProjectDetailsProps) => {
  return (
    <div className="panel__header">
      <div style={{ marginBottom: 5 }}>Concerant le projet:</div>
      <div
        className="text-quote"
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          marginBottom: 10,
        }}
      >
        <div {...dataId('modificationRequest-item-nomProjet')}>
          <a href={ROUTES.PROJECT_DETAILS(project.id)}>{project.nomProjet}</a>
        </div>
        <div
          style={{
            fontStyle: 'italic',
            lineHeight: 'normal',
            fontSize: 12,
          }}
        >
          <div {...dataId('modificationRequest-item-nomCandidat')}>{project.nomCandidat}</div>
          <span {...dataId('modificationRequest-item-communeProjet')}>{project.communeProjet}</span>
          ,{' '}
          <span {...dataId('modificationRequest-item-departementProjet')}>
            {project.departementProjet}
          </span>
          , <span {...dataId('modificationRequest-item-regionProjet')}>{project.regionProjet}</span>
        </div>
        <div {...dataId('modificationRequest-item-puissance')}>
          {project.puissance} {project.unitePuissance}
        </div>
        <div>
          Désigné le{' '}
          <span {...dataId('modificationRequest-item-designationDate')}>
            {formatDate(project.notifiedOn)}
          </span>{' '}
          pour la période{' '}
          <span {...dataId('modificationRequest-item-periode')}>
            {project.appelOffreId} {project.periodeId}
          </span>{' '}
          <span {...dataId('modificationRequest-item-famille')}>{project.familleId}</span>
        </div>
        {project.numeroGestionnaire ? (
          <div>Identifiant gestionnaire de réseau: {project.numeroGestionnaire}</div>
        ) : null}
      </div>
    </div>
  )
}
