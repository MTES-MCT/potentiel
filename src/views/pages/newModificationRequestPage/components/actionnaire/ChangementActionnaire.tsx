import { Project } from '@entities'
import React from 'react'
import { dataId } from '../../../../../helpers/testId'

type ChangementActionnaireProps = {
  project: Project
  actionnaire: string
  justification: string
}

export const ChangementActionnaire = ({
  project,
  actionnaire,
  justification,
}: ChangementActionnaireProps) => (
  <>
    <label>Ancien actionnaire</label>
    <input type="text" disabled defaultValue={project.actionnaire} />
    <label className="required" htmlFor="actionnaire">
      Nouvel actionnaire
    </label>
    <input
      type="text"
      name="actionnaire"
      id="actionnaire"
      defaultValue={actionnaire || ''}
      {...dataId('modificationRequest-actionnaireField')}
    />
    <label htmlFor="candidats">Statuts mis à jour</label>
    <input type="file" name="file" {...dataId('modificationRequest-fileField')} id="file" />
    <label style={{ marginTop: 10 }} className="required" htmlFor="justification">
      <strong>Veuillez nous indiquer les raisons qui motivent cette modification</strong>
      <br />
      Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant conduit à
      ce besoin de modification (contexte, facteurs extérieurs, etc)
    </label>
    <textarea
      name="justification"
      id="justification"
      defaultValue={justification || ''}
      {...dataId('modificationRequest-justificationField')}
    />
  </>
)
