import { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import routes from '@routes'
import ROUTES from '@routes'
import { AdminDashboard } from '@components'

type AdminAppelOffreProps = {
  request: Request
}

/* Pure component */
export default function AdminAppelOffre({ request }: AdminAppelOffreProps) {
  const { error, success } = (request.query as any) || {}

  return (
    <AdminDashboard role={request.user?.role} currentPage="admin-ao">
      <div className="panel">
        <div className="panel__header">
          <h3>Appels d'offres</h3>
        </div>

        {success ? (
          <div className="notification success" {...dataId('success-message')}>
            {success}
          </div>
        ) : (
          ''
        )}
        {error ? (
          <div className="notification error" {...dataId('error-message')}>
            {error}
          </div>
        ) : (
          ''
        )}

        <div className="panel__header">
          <form
            action={ROUTES.IMPORT_AO_ACTION}
            method="post"
            encType="multipart/form-data"
            style={{ maxWidth: 'auto', margin: '0 0 15px 0' }}
          >
            <h4>Mettre à jour les appels d'offre</h4>
            <a href={routes.EXPORT_AO_CSV} download>
              Télécharger les données actuelles
            </a>
            <div className="form__group">
              <label htmlFor="appelsOffresFile">Fichier des appels d'offre</label>
              <input type="file" name="appelsOffresFile" id="appelsOffresFile" />
            </div>
            <button className="button" type="submit" name="submit" {...dataId('submit-button')}>
              Envoyer
            </button>
          </form>
        </div>

        <form
          action={ROUTES.IMPORT_PERIODE_ACTION}
          method="post"
          encType="multipart/form-data"
          style={{ maxWidth: 'auto', margin: '0 0 15px 0' }}
        >
          <h4>Mettre à jour les périodes</h4>
          <a href={routes.EXPORT_PERIODE_CSV} download>
            Télécharger les données actuelles
          </a>
          <div className="form__group">
            <label htmlFor="periodesFile">Fichier des périodes</label>
            <input type="file" name="periodesFile" id="periodesFile" />
          </div>
          <button className="button" type="submit" name="submit" {...dataId('submit-button')}>
            Envoyer
          </button>
        </form>
      </div>
    </AdminDashboard>
  )
}
