import type { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import ROUTES from '@routes'
import { SuccessErrorBox, SecondaryButton, PageTemplate } from '../components'
import { hydrateOnClient } from '../helpers'

type ImporterListingEDFProps = {
  request: Request
}

export const ImporterListingEDF = ({ request }: ImporterListingEDFProps) => {
  const {
    query: { error, success },
  } = request

  return (
    <PageTemplate user={request.user}>
      <div className="panel">
        <div className="panel__header">
          <h3>Importer des données producteurs</h3>
        </div>

        <form action={ROUTES.IMPORTER_LISTING_EDF} method="post" encType="multipart/form-data">
          <SuccessErrorBox error={error as string} success={success as string} />
          <div>Sélectionner le fichier à importer.</div>
          <input type="file" name="file" />
          <SecondaryButton
            className="mt-2"
            type="submit"
            name="submit"
            id="submit"
            {...dataId('submit-button')}
          >
            Envoyer
          </SecondaryButton>
        </form>
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(ImporterListingEDF)
