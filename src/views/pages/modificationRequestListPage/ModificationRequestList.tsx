import { Request } from 'express';
import React, { ChangeEvent, useState } from 'react';
import { ModificationRequestListItemDTO } from '../../../modules/modificationRequest';
import { PaginatedList } from '../../../modules/pagination';
import { AppelOffre } from '@potentiel/domain-views';
import {
  RequestList,
  LinkButton,
  Heading1,
  BarreDeRecherche,
  Label,
  Select,
  Checkbox,
  Form,
  ListeVide,
  ArrowRightIcon,
  ArrowLeftIcon,
  Accordeon,
  SecondaryLinkButton,
  PageListeTemplate,
} from '../../components';
import { hydrateOnClient, resetUrlParams, updateUrlParams } from '../../helpers';
import { userIs } from '../../../modules/users';
import routes from '../../../routes';

type ModificationRequestListProps = {
  request: Request;
  modificationRequests: PaginatedList<ModificationRequestListItemDTO>;
  appelsOffre: Array<AppelOffre>;
  currentUrl: string;
};

export const ModificationRequestList = ({
  request,
  modificationRequests,
  appelsOffre,
  currentUrl,
}: ModificationRequestListProps) => {
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

  const handleShowOnlyDGEC = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsShowOnlyDGECChecked(isChecked);
    updateUrlParams({
      showOnlyDGEC: isChecked ? 'on' : 'off',
    });
  };

  const [isShowOnlyDGECChecked, setIsShowOnlyDGECChecked] = useState(showOnlyDGEC === 'on');
  const [filtersOpen, setFiltersOpen] = useState(true);

  const hasFilters = !!(
    appelOffreId ||
    periodeId ||
    familleId ||
    modificationRequestStatus ||
    modificationRequestType ||
    recherche
  );

  const periodes = appelsOffre.find((ao) => ao.id === appelOffreId)?.periodes;
  const filtreParPériodeActif = appelOffreId && periodes && periodes.length > 0;

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title));
  const filtreParFamilleActif = appelOffreId && familles && familles.length > 0;

  const targetRoute =
    request.user?.role === 'porteur-projet'
      ? routes.USER_LIST_REQUESTS
      : routes.ADMIN_LIST_REQUESTS;

  const formActionRoute = `${targetRoute}?showOnlyDGEC=${isShowOnlyDGECChecked ? 'on' : 'off'}`;

  return (
    <PageListeTemplate
      user={request.user}
      currentPage="list-requests"
      contentHeader={
        <Heading1 className="!text-white whitespace-nowrap">
          {request.user.role === 'porteur-projet' ? 'Mes demandes' : 'Demandes'}{' '}
          {modificationRequests.itemCount > 0 && ` (${modificationRequests.itemCount})`}
        </Heading1>
      }
    >
      <PageListeTemplate.TopBar success={success} error={error}>
        <div className="flex gap-4 order-2 mt-8 lg:mt-0 lg:order-1">
          <LinkButton
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="hidden lg:flex items-center w-fit show text-sm cursor-pointer"
          >
            {filtersOpen ? (
              <>
                <ArrowLeftIcon aria-hidden className="!text-white w-5 h-5 mr-2" />
                Masquer les filtres
              </>
            ) : (
              <>
                Afficher les filtres
                <ArrowRightIcon aria-hidden className="!text-white w-5 h-5 ml-2" />
              </>
            )}
          </LinkButton>
          {hasFilters && (
            <SecondaryLinkButton href="#" onClick={resetUrlParams} className="text-sm">
              Retirer tous les filtres
            </SecondaryLinkButton>
          )}
        </div>
        <Form
          action={formActionRoute}
          method="GET"
          className="w-full order-1 lg:order-2 lg:ml-auto"
        >
          <BarreDeRecherche
            placeholder="Rechercher par nom projet, candidat, numéro CRE, commune, département..."
            name="recherche"
            defaultValue={recherche || ''}
          />
        </Form>
      </PageListeTemplate.TopBar>
      <PageListeTemplate.SideBar open={filtersOpen}>
        <Accordeon
          title="Filtrer par appel d'offres"
          defaultOpen={!!appelOffreId}
          className="max-w-xl"
        >
          <Form action={formActionRoute} method="GET">
            <div>
              <Label htmlFor="appelOffreId">Appel d'offres concerné</Label>
              <Select
                id="appelOffreId"
                name="appelOffreId"
                defaultValue={appelOffreId || 'default'}
                onChange={(event) =>
                  updateUrlParams({
                    appelOffreId: event.target.value,
                    periodeId: null,
                    familleId: null,
                  })
                }
              >
                <option value="default" disabled hidden>
                  Choisir un appel d‘offres
                </option>
                <option value="">Tous appels d'offres</option>
                {appelsOffre.map((appelOffre) => (
                  <option key={`appel_${appelOffre.id}`} value={appelOffre.id}>
                    {appelOffre.shortTitle}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label
                htmlFor="periodeId"
                className="mt-4"
                disabled={!filtreParPériodeActif ? true : undefined}
              >
                Période concernée
              </Label>
              <Select
                id="periodeId"
                name="periodeId"
                defaultValue={periodeId}
                disabled={!filtreParPériodeActif}
                onChange={(event) =>
                  updateUrlParams({
                    periodeId: event.target.value,
                  })
                }
              >
                <option value="default" disabled hidden>
                  Choisir une période
                </option>
                <option value="">Toutes périodes</option>
                {periodes &&
                  periodes.map((periode) => (
                    <option key={`appel_${periode.id}`} value={periode.id}>
                      {periode.title}
                    </option>
                  ))}
              </Select>
            </div>
            <div>
              <Label
                htmlFor="familleId"
                className="mt-4"
                disabled={!filtreParFamilleActif ? true : undefined}
              >
                Famille concernée
              </Label>
              <Select
                id="familleId"
                name="familleId"
                defaultValue={familleId || 'default'}
                disabled={!filtreParFamilleActif}
                onChange={(event) =>
                  updateUrlParams({
                    familleId: event.target.value,
                  })
                }
              >
                <option value="default" disabled hidden>
                  Choisir une famille
                </option>
                <option value="">Toutes familles</option>
                {familles &&
                  familles.map((famille) => (
                    <option key={`appel_${famille.id}`} value={famille.id}>
                      {famille.title}
                    </option>
                  ))}
              </Select>
            </div>
          </Form>
        </Accordeon>
        <Accordeon
          title="Filtrer par type de demande"
          defaultOpen={!!modificationRequestType}
          className="max-w-xl"
        >
          <Form action={formActionRoute} method="GET">
            <div>
              <Label htmlFor="modificationRequestType">Type de demande</Label>
              <Select
                id="modificationRequestType"
                name="modificationRequestType"
                defaultValue={modificationRequestType || 'default'}
                onChange={(event) =>
                  updateUrlParams({
                    modificationRequestType: event.target.value,
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
            </div>
          </Form>
        </Accordeon>
        <Accordeon
          title="Filtrer par statut de la demande"
          defaultOpen={!!modificationRequestStatus}
          className="max-w-xl"
        >
          <Form action={formActionRoute} method="GET">
            <div>
              <Label htmlFor="modificationRequestStatus">Statut de la demande</Label>
              <Select
                id="modificationRequestStatus"
                name="modificationRequestStatus"
                defaultValue={modificationRequestStatus || 'default'}
                onChange={(event) =>
                  updateUrlParams({
                    modificationRequestStatus: event.target.value,
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
            </div>
          </Form>
        </Accordeon>
      </PageListeTemplate.SideBar>
      <PageListeTemplate.List sideBarOpen={filtersOpen}>
        {userIs(['admin', 'dgec-validateur'])(request.user) && (
          <Form action={formActionRoute} method="GET">
            <div className="flex flex-row mb-5">
              <Checkbox
                id="showOnlyDGEC"
                name="showOnlyDGEC"
                checked={isShowOnlyDGECChecked}
                onChange={handleShowOnlyDGEC}
              >
                Afficher seulement les demandes adressées à la DGEC
              </Checkbox>
            </div>
          </Form>
        )}

        {modificationRequests.items.length === 0 ? (
          <ListeVide titre="Aucune demande n’a été trouvée" />
        ) : (
          <RequestList
            modificationRequests={modificationRequests}
            role={request.user?.role}
            currentUrl={currentUrl}
          />
        )}
      </PageListeTemplate.List>
    </PageListeTemplate>
  );
};

hydrateOnClient(ModificationRequestList);
