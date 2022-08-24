import type { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import ROUTES from '@routes'
import { SuccessErrorBox } from '../components'
import { AdminDashboard, PageLayout, SecondaryButton } from '@components'

type ImporterListingEnedisProps = {
  request: Request
}

export const ImporterListingEnedis = PageLayout(({ request }: ImporterListingEnedisProps) => {
  const {
    user: { role },
    query: { error, success },
  } = request

  return (
    <AdminDashboard role={role} currentPage={'import-enedis'}>
      <div className="panel">
        <div className="panel__header">
          <h3>Importer des données Enedis</h3>
        </div>

        <form action={ROUTES.IMPORTER_LISTING_ENEDIS} method="post" encType="multipart/form-data">
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
    </AdminDashboard>
  )
})
