import { Request } from 'express'
import React from 'react'
import { Project } from '../../entities'
import { formatDate } from '../../helpers/formatDate'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'
import AdminDashboard from '../components/adminDashboard'
import ProjectList from '../components/projectList'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'

type AdminRegenerateCertificatesProps = {
  request: Request
}

/* Pure component */
export default function AdminRegenerateCertificates({ request }: AdminRegenerateCertificatesProps) {
  const { error, success, appelOffreAndPeriode, notificationDate, reason } = request.query || {}

  return (
    <AdminDashboard role={request.user?.role} currentPage="regenerate-certificates">
      <div className="panel">
        <div className="panel__header">
          <h3>Regénérer des attestations</h3>
        </div>

        <p>
          Cette page permet de relancer la génération d‘une attestation pour l‘intégralité des
          projets d‘une période. Cette fonction peut être utile lorsqu‘une erreur a pu être corrigée
          sur le modèle de l‘attestation ou dans les données relatives à un appel d‘offre.
        </p>

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

        <form
          action={ROUTES.ADMIN_REGENERATE_CERTIFICATES_ACTION}
          method="post"
          style={{ maxWidth: 'auto', margin: '0 0 15px 0' }}
        >
          <div className="form__group">
            <label>Période concernée</label>
            <select name="appelOffreAndPeriode" defaultValue={appelOffreAndPeriode}>
              {appelsOffreStatic.reduce((periodes: React.ReactNode[], appelOffre) => {
                return periodes?.concat(
                  appelOffre.periodes.map((periode) => (
                    <option
                      key={`${appelOffre.id}|${periode.id}`}
                      value={`${appelOffre.id}|${periode.id}`}
                    >
                      {appelOffre.id} - {periode.id}
                    </option>
                  ))
                )
              }, [] as React.ReactNode[])}
            </select>
          </div>
          <div className="form__group">
            <label htmlFor="notificationDate">
              Nouvelle date de désignation (facultatif, format JJ/MM/AAAA)
            </label>
            <input
              type="text"
              name="notificationDate"
              id="notificationDate"
              defaultValue={notificationDate}
              {...dataId('date-field')}
              style={{ width: 'auto' }}
            />
            <div
              className="notification error"
              style={{ display: 'none' }}
              {...dataId('error-message-wrong-format')}
            >
              Le format de la date saisie n’est pas conforme. Elle doit être de la forme JJ/MM/AAAA
              soit par exemple 25/05/2022 pour 25 Mai 2022.
            </div>
          </div>
          <div className="form__group">
            <label htmlFor="forceCertificateGeneration">
              Message justificatif du changement (facultatif, sera inclus dans le mail aux porteurs
              de projet)
            </label>
            <textarea name="reason" defaultValue={reason} />
          </div>

          <button
            className="button"
            type="submit"
            name="submit"
            {...dataId('submit-button')}
            data-confirm={`Etes-vous sur de vouloir regénérer les attestations pour tous les projets de cette période ?`}
          >
            Regénérer les attestations des projets de cette période
          </button>
          <p>
            Un email sera envoyé aux porteurs de projets pour leur signaler la mise à jour de leur
            attestation.{' '}
          </p>
        </form>
      </div>
    </AdminDashboard>
  )
}
