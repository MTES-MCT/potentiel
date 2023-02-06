import { Request } from 'express'
import React, { ChangeEvent, useState } from 'react'
import { AppelOffre } from '@entities'
import { dataId } from '../../../helpers/testId'
import { ModificationRequestListItemDTO } from '@modules/modificationRequest'
import ROUTES from '@routes'
import { PaginatedList } from '../../../types'
import {
  RequestList,
  PageTemplate,
  SuccessBox,
  ErrorBox,
  InputCheckbox,
  Link,
  Heading1,
} from '@components'
import { hydrateOnClient, refreshPageWithNewSearchParamValue } from '../../helpers'
import { userIs } from '@modules/users'

type ModificationRequestListProps = {
  request: Request
  modificationRequests?: PaginatedList<ModificationRequestListItemDTO>
  appelsOffre: Array<AppelOffre>
}

export const ModificationRequestList = ({
  request,
  modificationRequests,
  appelsOffre,
}: ModificationRequestListProps) => {
  const handleShowOnlyDGEC = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setIsShowOnlyDGECChecked(isChecked)
    refreshPageWithNewSearchParamValue('showOnlyDGEC', `${isChecked ? 'on' : 'off'}`)
  }

  const {
    error,
    success,
    recherche,
    appelOffreId,
    periodeId,
    familleId,
    modificationRequestStatus,
    modificationRequestType,
    showOnlyDGEC = 'on',
  } = (request.query as any) || {}

  const [isShowOnlyDGECChecked, setIsShowOnlyDGECChecked] = useState(showOnlyDGEC === 'on')

  const hasFilters =
    appelOffreId || periodeId || familleId || modificationRequestStatus || modificationRequestType

  const periodes = appelsOffre.find((ao) => ao.id === appelOffreId)?.periodes

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))

  return (
    <PageTemplate user={request.user} currentPage="list-requests">
      <div className="panel">
        <div className="panel__header">
          <Heading1>
            {request.user.role === 'porteur-projet' ? 'Mes demandes' : 'Demandes'}
          </Heading1>
          <form
            action={`${
              request.user?.role === 'porteur-projet'
                ? ROUTES.USER_LIST_REQUESTS
                : ROUTES.ADMIN_LIST_REQUESTS
            }?showOnlyDGEC=${isShowOnlyDGECChecked ? 'on' : 'off'}`}
            method="GET"
            className="max-w-2xl lg:max-w-3xl mx-0 mb-6"
          >
            <div className="mt-5 form__group">
              <BarreRecherche
                placeholder="Nom projet, candidat, numéro CRE, commune, département, ..."
                name="recherche"
                className="pr-10"
                defaultValue={recherche || ''}
              />
            </div>

            <div className="form__group">
              <div
                {...dataId('visibility-toggle')}
                className={'filter-toggle' + (hasFilters ? ' open' : '')}
              >
                <span
                  style={{
                    borderBottom: '1px solid var(--light-grey)',
                    paddingBottom: 5,
                  }}
                >
                  Filtrer
                </span>
                <svg className="icon filter-icon">
                  <use xlinkHref="#expand"></use>
                </svg>
              </div>
              <div className="filter-panel">
                <div className="periode-panel mt-[15px]">
                  <div className="ml-[2px]">Par appel d'offre, période et famille</div>
                  <select
                    name="appelOffreId"
                    className={'appelOffre ' + (appelOffreId ? 'active' : '')}
                    {...dataId('appelOffreIdSelector')}
                    defaultValue={appelOffreId}
                  >
                    <option value="">Tous appels d'offres</option>
                    {appelsOffre.map((appelOffre) => (
                      <option key={'appel_' + appelOffre.id} value={appelOffre.id}>
                        {appelOffre.shortTitle}
                      </option>
                    ))}
                  </select>
                  <select
                    name="periodeId"
                    className={periodeId ? 'active' : ''}
                    {...dataId('periodeIdSelector')}
                    defaultValue={periodeId}
                  >
                    <option value="">Toutes périodes</option>
                    {periodes && periodes.length
                      ? periodes.map((periode) => (
                          <option key={'appel_' + periode.id} value={periode.id}>
                            {periode.title}
                          </option>
                        ))
                      : null}
                  </select>
                  {!appelOffreId || (familles && familles.length) ? (
                    <select
                      name="familleId"
                      className={familleId ? 'active' : ''}
                      {...dataId('familleIdSelector')}
                      defaultValue={familleId}
                    >
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
                <div style={{ marginTop: 15 }}>
                  <div style={{ marginLeft: 2 }}>Type</div>
                  <select
                    name="modificationRequestType"
                    className={modificationRequestType ? 'active' : ''}
                    {...dataId('modificationRequestTypeSelector')}
                    defaultValue={modificationRequestType || ''}
                  >
                    <option value="">Tous</option>
                    <option value="actionnaire">Actionnaire</option>
                    <option value="fournisseur">Fournisseur</option>
                    <option value="producteur">Producteur</option>
                    <option value="puissance">Puissance</option>
                    <option value="recours">Recours</option>
                    <option value="delai">Délai</option>
                    <option value="abandon">Abandon</option>
                    <option value="annulation abandon">Annulation abandon</option>
                  </select>
                </div>
                <div style={{ marginTop: 15 }}>
                  <div style={{ marginLeft: 2 }}>Statut</div>
                  <select
                    name="modificationRequestStatus"
                    className={modificationRequestStatus ? 'active' : ''}
                    {...dataId('modificationRequestStatusSelector')}
                    defaultValue={modificationRequestStatus || ''}
                  >
                    <option value="">Tous</option>
                    <option value="envoyée">Envoyée</option>
                    <option value="en instruction">En instruction</option>
                    <option value="en attente de confirmation">En attente de confirmation</option>
                    <option value="demande confirmée">Demande confirmée</option>
                    <option value="acceptée">Acceptée</option>
                    <option value="rejetée">Rejetée</option>
                    <option value="annulée">Annulée</option>
                    <option value="information validée">Information validée</option>
                  </select>
                </div>
              </div>
            </div>

            {hasFilters && (
              <Link className="mt-[10px]" href="#" {...dataId('resetSelectors')}>
                Retirer tous les filtres
              </Link>
            )}

            {userIs(['admin', 'dgec-validateur'])(request.user) && (
              <div className="flex flex-row mt-5">
                <InputCheckbox
                  id="showOnlyDGEC"
                  name="showOnlyDGEC"
                  type="checkbox"
                  checked={isShowOnlyDGECChecked}
                  onChange={handleShowOnlyDGEC}
                />
                <label htmlFor="showOnlyDGEC">
                  Afficher seulement les demandes adressées à la DGEC
                </label>
              </div>
            )}
          </form>
        </div>
        {success && <SuccessBox title={success} />}
        {error && <ErrorBox title={error} />}
        <RequestList modificationRequests={modificationRequests} role={request.user?.role} />
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(ModificationRequestList)
