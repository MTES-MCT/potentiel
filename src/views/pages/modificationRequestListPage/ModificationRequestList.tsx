import { Request } from 'express';
import React, { ChangeEvent, useState } from 'react';
import { AppelOffre } from '@entities';
import { ModificationRequestListItemDTO } from '@modules/modificationRequest';
import ROUTES from '@routes';
import { PaginatedList } from '../../../types';
import {
  RequestList,
  PageTemplate,
  SuccessBox,
  ErrorBox,
  InputCheckbox,
  Link,
  Heading1,
  BarreDeRecherche,
  Label,
  Select,
  Dropdown,
} from '@components';
import {
  hydrateOnClient,
  refreshPageWithNewSearchParamValue,
  resetUrlParams,
  updateUrlParams,
} from '../../helpers';
import { userIs } from '@modules/users';

type ModificationRequestListProps = {
  request: Request;
  modificationRequests?: PaginatedList<ModificationRequestListItemDTO>;
  appelsOffre: Array<AppelOffre>;
};

export const ModificationRequestList = ({
  request,
  modificationRequests,
  appelsOffre,
}: ModificationRequestListProps) => {
  const handleShowOnlyDGEC = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsShowOnlyDGECChecked(isChecked);
    refreshPageWithNewSearchParamValue('showOnlyDGEC', `${isChecked ? 'on' : 'off'}`);
  };

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
  } = (request.query as any) || {};

  const [isShowOnlyDGECChecked, setIsShowOnlyDGECChecked] = useState(showOnlyDGEC === 'on');

  const hasFilters = !!(
    appelOffreId ||
    periodeId ||
    familleId ||
    modificationRequestStatus ||
    modificationRequestType
  );

  const periodes = appelsOffre.find((ao) => ao.id === appelOffreId)?.periodes;

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title));

  const [afficherFiltres, setAfficherFiltres] = useState(hasFilters);

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
            <BarreDeRecherche
              placeholder="Nom projet, candidat, numéro CRE, commune, département, ..."
              name="recherche"
              defaultValue={recherche || ''}
              className="mt-8"
            />

            <Dropdown
              design="link"
              text="Filtrer"
              isOpen={afficherFiltres}
              changeOpenState={(state) => setAfficherFiltres(state)}
              className="mt-8 mb-6 !w-full"
            >
              <div className="mt-8">
                <fieldset>
                  <Label htmlFor="appelOffreId">Appel d'offre concerné</Label>
                  <Select
                    id="appelOffreId"
                    name="appelOffreId"
                    defaultValue={appelOffreId || 'default'}
                    onChange={(event) =>
                      updateUrlParams({
                        appelOffreId: event.target.value,
                        periodeId: null,
                        familleId: null,
                        page: null,
                      })
                    }
                  >
                    <option value="default" disabled hidden>
                      Choisir un appel d‘offre
                    </option>
                    <option value="">Tous appels d'offres</option>
                    {appelsOffre.map((appelOffre) => (
                      <option key={'appel_' + appelOffre.id} value={appelOffre.id}>
                        {appelOffre.shortTitle}
                      </option>
                    ))}
                  </Select>
                  {appelOffreId && periodes && periodes.length > 0 && (
                    <>
                      <Label htmlFor="periodeId" className="mt-4">
                        Période concernée
                      </Label>
                      <Select
                        id="periodeId"
                        name="periodeId"
                        defaultValue={periodeId || 'default'}
                        onChange={(event) =>
                          updateUrlParams({
                            periodeId: event.target.value,
                            page: null,
                          })
                        }
                      >
                        <option value="default" disabled hidden>
                          Choisir une période
                        </option>
                        <option value="">Toutes périodes</option>
                        {periodes.map((periode) => (
                          <option key={`appel_${periode.id}`} value={periode.id}>
                            {periode.title}
                          </option>
                        ))}
                      </Select>
                    </>
                  )}
                  {appelOffreId && familles && familles.length > 0 && (
                    <>
                      <Label htmlFor="familleId" className="mt-4">
                        Famille concernée
                      </Label>
                      <Select
                        id="familleId"
                        name="familleId"
                        defaultValue={familleId || 'default'}
                        onChange={(event) =>
                          updateUrlParams({
                            familleId: event.target.value,
                            page: null,
                          })
                        }
                      >
                        <option value="default" disabled hidden>
                          Choisir une famille
                        </option>
                        <option value="">Toutes familles</option>
                        {familles.map((famille) => (
                          <option key={`appel_${famille.id}`} value={famille.id}>
                            {famille.title}
                          </option>
                        ))}
                      </Select>
                    </>
                  )}
                  <Label htmlFor="modificationRequestType" className="mt-4">
                    Type de demande
                  </Label>
                  <Select
                    id="modificationRequestType"
                    name="modificationRequestType"
                    defaultValue={modificationRequestType || 'default'}
                    onChange={(event) =>
                      updateUrlParams({
                        modificationRequestType: event.target.value,
                        page: null,
                      })
                    }
                  >
                    <option value="default" disabled hidden>
                      Choisir un type de demande
                    </option>
                    <option value="">Tous</option>
                    <option value="actionnaire">Actionnaire</option>
                    <option value="fournisseur">Fournisseur</option>
                    <option value="producteur">Producteur</option>
                    <option value="puissance">Puissance</option>
                    <option value="recours">Recours</option>
                    <option value="delai">Délai</option>
                    <option value="abandon">Abandon</option>
                    <option value="annulation abandon">Annulation abandon</option>
                  </Select>
                  <Label htmlFor="modificationRequestStatus" className="mt-4">
                    Statut de la demande
                  </Label>
                  <Select
                    id="modificationRequestStatus"
                    name="modificationRequestStatus"
                    defaultValue={modificationRequestStatus || 'default'}
                    onChange={(event) =>
                      updateUrlParams({
                        modificationRequestStatus: event.target.value,
                        page: null,
                      })
                    }
                  >
                    <option value="default" disabled hidden>
                      Choisir le statut de la demande
                    </option>
                    <option value="">Tous</option>
                    <option value="envoyée">Envoyée</option>
                    <option value="en instruction">En instruction</option>
                    <option value="en attente de confirmation">En attente de confirmation</option>
                    <option value="demande confirmée">Demande confirmée</option>
                    <option value="acceptée">Acceptée</option>
                    <option value="rejetée">Rejetée</option>
                    <option value="annulée">Annulée</option>
                    <option value="information validée">Information validée</option>
                  </Select>
                </fieldset>
              </div>
            </Dropdown>

            {hasFilters && (
              <Link href="#" onClick={resetUrlParams}>
                Retirer tous les filtres
              </Link>
            )}

            {userIs(['admin', 'dgec-validateur'])(request.user) && (
              <div className="flex flex-row mt-5">
                <InputCheckbox
                  id="showOnlyDGEC"
                  name="showOnlyDGEC"
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
  );
};

hydrateOnClient(ModificationRequestList);
