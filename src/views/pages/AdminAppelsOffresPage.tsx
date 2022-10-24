import { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import routes from '@routes'
import { AdminDashboard, Button, PageTemplate } from '@components'

type AdminAppelOffreProps = {
  request: Request
}

export const AdminAppelsOffres = ({ request }: AdminAppelOffreProps) => {
  const { error, success } = (request.query as any) || {}

  return (
    <PageTemplate user={request.user}>
      <AdminDashboard role={request.user?.role} currentPage="admin-ao">
        <div className="panel">
          <div className="panel__header">
            <h3>Gérer les appels d'offres</h3>
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
              action={routes.IMPORT_AO_ACTION}
              method="post"
              encType="multipart/form-data"
              style={{ maxWidth: 'auto', margin: '0 0 15px 0' }}
            >
              <h4>Mettre à jour les appels d'offres</h4>
              <a href={routes.EXPORT_AO_CSV} download>
                Télécharger les données actuelles
              </a>
              <div className="form__group">
                <label htmlFor="appelsOffresFile">Fichier des appels d'offres</label>
                <input type="file" name="appelsOffresFile" id="appelsOffresFile" />
              </div>
              <Button type="submit" className="mt-4" {...dataId('submit-button')}>
                Envoyer
              </Button>
            </form>
          </div>

          <form
            action={routes.IMPORT_PERIODE_ACTION}
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
            <Button type="submit" className="mt-4" {...dataId('submit-button')}>
              Envoyer
            </Button>
          </form>
        </div>
      </AdminDashboard>
    </PageTemplate>
  )
}
