import { Astérisque } from '@components'
import { Project } from '@entities'
import React from 'react'
import { dataId } from '../../../../../helpers/testId'

type ChangementProducteurProps = {
  project: Project
  justification: string
}

export const ChangementProducteur = ({ project, justification }: ChangementProducteurProps) => {
  const { appelOffre } = project
  const isEolien = appelOffre?.type === 'eolien'

  return (
    <>
      {isEolien && (
        <div className="notification error my-4">
          <span>
            Vous ne pouvez pas changer de producteur avant la date d'achèvement de ce projet.
          </span>
        </div>
      )}
      <label>Ancien producteur</label>
      <input type="text" disabled defaultValue={project.nomCandidat} />
      {!isEolien && appelOffre?.isSoumisAuxGFs && (
        <div className="notification warning my-4">
          <span>
            Attention : de nouvelles garanties financières devront être déposées d'ici un mois
          </span>
        </div>
      )}
      <label htmlFor="producteur">
        Nouveau producteur <Astérisque />
      </label>
      <input
        type="text"
        name="producteur"
        id="producteur"
        {...dataId('modificationRequest-producteurField')}
        disabled={isEolien}
        required
      />
      <label htmlFor="candidats" className="mt-4">
        Statuts mis à jour
      </label>
      <input type="file" name="file" {...dataId('modificationRequest-fileField')} id="file" />
      <label className="mt-4" htmlFor="justification">
        <strong>Veuillez nous indiquer les raisons qui motivent cette modification</strong>{' '}
        <Astérisque />
        <br />
        Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant conduit
        à ce besoin de modification (contexte, facteurs extérieurs, etc)
      </label>
      <textarea
        name="justification"
        id="justification"
        defaultValue={justification || ''}
        {...dataId('modificationRequest-justificationField')}
      />
    </>
  )
}
