import React from 'react'
import { dataId } from '../../../../../helpers/testId'

import { Label } from '@components'

type DemandeRecoursProps = {
  justification: string
}

export const DemandeRecours = ({ justification }: DemandeRecoursProps) => (
  <>
    <Label htmlFor="justification" className="mt-4">
      <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong>
      <br />
      Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant conduit à
      ce besoin de modification (contexte, facteurs extérieurs, etc)
    </Label>
    <textarea
      name="justification"
      id="justification"
      defaultValue={justification || ''}
      {...dataId('modificationRequest-justificationField')}
    />
    <label htmlFor="candidats">Pièce justificative (si nécessaire)</label>
    <input type="file" name="file" {...dataId('modificationRequest-fileField')} id="file" />
  </>
)
