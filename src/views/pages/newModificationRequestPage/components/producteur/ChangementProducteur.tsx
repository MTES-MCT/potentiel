import { Project } from '@entities'
import React from 'react'
import { dataId } from '../../../../../helpers/testId'

type ChangementProducteurProps = {
  project: Project
  justification: string
}

export const ChangementProducteur = ({ project, justification }: ChangementProducteurProps) => {
  const { appelOffre } = project

  return (
    <>
      <label>Ancien producteur</label>
      <input type="text" disabled defaultValue={project.nomCandidat} />
      {appelOffre?.isSoumisAuxGFs && (
        <div className="notification warning" style={{ marginTop: 10, marginBottom: 10 }}>
          <span>
            Attention : de nouvelles garanties financières devront être déposées d'ici un mois
          </span>
        </div>
      )}
      <label className="required" htmlFor="producteur">
        Nouveau producteur
      </label>
      <input
        type="text"
        name="producteur"
        id="producteur"
        {...dataId('modificationRequest-producteurField')}
      />
      <label htmlFor="candidats">Statuts mis à jour</label>
      <input type="file" name="file" {...dataId('modificationRequest-fileField')} id="file" />
      <label style={{ marginTop: 10 }} className="required" htmlFor="justification">
        <strong>Veuillez nous indiquer les raisons qui motivent cette modification</strong>
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
