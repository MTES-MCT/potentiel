import React from 'react'
import { Astérisque } from '@components'
import { dataId } from '../../../../../helpers/testId'

type DemandeAbandonProps = {
  justification: string
}

export const DemandeAbandon = ({ justification }: DemandeAbandonProps) => (
  <>
    <label htmlFor="justification">
      <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong> <Astérisque />
      <br />
      Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant conduit à
      ce besoin de modification (contexte, facteurs extérieurs, etc)
    </label>
    <textarea
      name="justification"
      id="justification"
      defaultValue={justification || ''}
      required={true}
      {...dataId('modificationRequest-justificationField')}
    />
    <label htmlFor="candidats">Pièce justificative</label>
    <input type="file" name="file" {...dataId('modificationRequest-fileField')} id="file" />
  </>
)
