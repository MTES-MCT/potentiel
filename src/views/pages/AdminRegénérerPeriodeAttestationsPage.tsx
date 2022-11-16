import { Request } from 'express'
import React from 'react'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import { dataId } from '../../helpers/testId'
import ROUTES from '@routes'
import { Button, ErrorBox, PageTemplate, SuccessBox } from '@components'
import { hydrateOnClient } from '../helpers'

type AdminRegénérerPeriodeAttestationsProps = {
  request: Request
}

export const AdminRegénérerPeriodeAttestations = ({
  request,
}: AdminRegénérerPeriodeAttestationsProps) => {
  const { error, success, appelOffreId, periodeId, familleId, notificationDate, reason } =
    (request.query as any) || {}

  const periodes = appelsOffreStatic.find((ao) => ao.id === appelOffreId)?.periodes

  const familles = appelsOffreStatic
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))

  return (
    <PageTemplate user={request.user} currentPage="regenerate-certificates">
      <div className="panel">
        <div className="panel__header">
          <h3>Regénérer des attestations</h3>
        </div>

        <p>
          Cette page permet de relancer la génération d‘une attestation pour l‘intégralité des
          projets d‘une période. Cette fonction peut être utile lorsqu‘une erreur a pu être corrigée
          sur le modèle de l‘attestation ou dans les données relatives à un appel d‘offre.
        </p>

        {success && <SuccessBox title={success} className="mb-3" />}
        {error && <ErrorBox title={error} className="mb-3" />}

        <form
          action={ROUTES.ADMIN_REGENERATE_CERTIFICATES_ACTION}
          method="post"
          style={{ maxWidth: 'auto', margin: '0 0 15px 0' }}
        >
          <div className="periode-panel form__group">
            <div style={{ marginLeft: 2 }}>Période concernée</div>
            <select
              name="appelOffreId"
              {...dataId('appelOffreIdSelector')}
              defaultValue={appelOffreId}
            >
              <option value="">Choisir appel d‘offre</option>
              {appelsOffreStatic
                .filter((appelOffre) => appelOffre.id !== 'PPE2 - Bâtiment 2')
                .map((appelOffre) => (
                  <option key={'appel_' + appelOffre.id} value={appelOffre.id}>
                    {appelOffre.shortTitle}
                  </option>
                ))}
            </select>
            {periodes && periodes.length ? (
              <select
                name="periodeId"
                {...dataId('periodeIdSelector')}
                defaultValue={periodeId || periodes[periodes.length - 1].id}
              >
                {periodes.map((periode) => (
                  <option key={'appel_' + periode.id} value={periode.id}>
                    {periode.title}
                  </option>
                ))}
              </select>
            ) : (
              ''
            )}
            {appelOffreId && familles && familles.length ? (
              <select name="familleId" defaultValue={familleId}>
                <option value="">Toutes familles</option>
                {familles && familles.length
                  ? familles.map((famille) => (
                      <option key={'appel_' + famille.id} value={famille.id}>
                        {famille.title}
                      </option>
                    ))
                  : null}
              </select>
            ) : null}
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

          <Button
            className="mt-2"
            type="submit"
            name="submit"
            {...dataId('submit-button')}
            data-confirm={`Etes-vous sur de vouloir regénérer les attestations pour tous les projets de cette période ?`}
          >
            Regénérer les attestations des projets de cette période
          </Button>
          <p>
            Un email sera envoyé aux porteurs de projets pour leur signaler la mise à jour de leur
            attestation.{' '}
          </p>
        </form>
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(AdminRegénérerPeriodeAttestations)
