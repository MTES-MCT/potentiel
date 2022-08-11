import React from 'react'
import { Label } from '@components'
import { dataId } from '../../../../../helpers/testId'

type DemandeAbandonProps = {
  justification: string
}

export const DemandeAbandon = ({ justification }: DemandeAbandonProps) => (
  <>
    <Label htmlFor="justification">
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
    <label htmlFor="candidats">Pièce justificative</label>
    <input type="file" name="file" {...dataId('modificationRequest-fileField')} id="file" />
  </>
)
