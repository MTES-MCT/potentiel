import type { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'
import { SuccessErrorBox } from '../components'
import { PageLayout } from '../components/PageLayout'
import PartnerDashboard from '../components/PartnerDashboard'

type UploadEDFFileProps = {
  request: Request
}

export const UploadEDFFile = PageLayout(({ request }: UploadEDFFileProps) => {
  const {
    user: { role },
    query: { error, success },
  } = request

  return (
    <PartnerDashboard role={role} currentPage={'upload-edf'}>
      <div className="panel">
        <div className="panel__header">
          <h3>Importer des données producteurs</h3>
        </div>

        <form action={ROUTES.UPLOAD_EDF_FILE} method="post" encType="multipart/form-data">
          <SuccessErrorBox error={error as string} success={success as string} />
          <div>Sélectionner le fichier à importer.</div>
          <input type="file" name="file" />
          <button
            className="button"
            type="submit"
            name="submit"
            id="submit"
            {...dataId('submit-button')}
          >
            Envoyer
          </button>
        </form>
      </div>
    </PartnerDashboard>
  )
})
