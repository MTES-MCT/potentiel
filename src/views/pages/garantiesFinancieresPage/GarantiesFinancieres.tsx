import { Request } from 'express';
import querystring from 'querystring';
import React, { useState } from 'react';
import { AppelOffre, Famille, Periode } from '@entities';
import ROUTES from '@routes';
import { PaginatedList } from '../../../types';
import {
  ProjectList,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  LinkButton,
  Heading1,
  DownloadLink,
  BarreDeRecherche,
  ListeVide,
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
import { GarantiesFinancieresFilter } from './components';
import { ProjectListItem } from '@modules/project/queries';

export type GarantiesFinancieresProps = {
  request: Request;
  projects: PaginatedList<ProjectListItem>;
  appelsOffre: Array<AppelOffre>;
  existingAppelsOffres: Array<AppelOffre['id']>;
  existingPeriodes?: Array<Periode['id']>;
  existingFamilles?: Array<Famille['id']>;
};

export const GarantiesFinancieres = ({
  request,
  projects,
  appelsOffre,
  existingAppelsOffres,
  existingPeriodes,
  existingFamilles,
}: GarantiesFinancieresProps) => {
  const { error, success, recherche, appelOffreId, periodeId, familleId, garantiesFinancieres } =
    (request.query as any) || {};

  const hasFilters = !!(appelOffreId || periodeId || familleId);

  const periodes = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.periodes.filter((periode) => !existingPeriodes || existingPeriodes.includes(periode.id));

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))
    .filter((famille) => !existingFamilles || existingFamilles.includes(famille.id));

  const handleGarantiesFinancieresFilterOnChange = (newValue: string) => {
    refreshPageWithNewSearchParamValue('garantiesFinancieres', newValue);
  };

  const [afficherFiltres, setAfficherFiltres] = useState(hasFilters);

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-garanties-financieres">
      <Heading1>Garanties financières</Heading1>

      <form action={ROUTES.ADMIN_GARANTIES_FINANCIERES} method="GET" className="m-0">
        <BarreDeRecherche
          placeholder="Rechercher par nom du projet"
          name="recherche"
          defaultValue={recherche || ''}
          className="mt-8"
        />

        <Dropdown
          design="link"
          text="Filtrer"
          isOpen={afficherFiltres}
          changeOpenState={(state) => setAfficherFiltres(state)}
          className="mt-8 mb-4 !w-full"
        >
          <div className="mt-4">
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
              {appelsOffre
                .filter((appelOffre) => existingAppelsOffres.includes(appelOffre.id))
                .map((appelOffre) => (
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
                    <option key={'appel_' + famille.id} value={famille.id}>
                      {famille.title}
                    </option>
                  ))}
                </Select>
              </>
            )}
          </div>
        </Dropdown>

        {hasFilters && (
          <LinkButton className="mt-[10px]" href="#" onClick={resetUrlParams}>
            Retirer tous les filtres
          </LinkButton>
        )}

        <GarantiesFinancieresFilter
          defaultValue={garantiesFinancieres}
          onChange={handleGarantiesFinancieresFilterOnChange}
        />
      </form>
      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}
      {projects.items.length === 0 ? (
        <ListeVide titre="Aucune garantie financière à lister" />
      ) : (
        <>
          <div className="mb-8">
            <DownloadLink
              fileUrl={`${ROUTES.EXPORTER_LISTE_PROJETS_CSV}?${querystring.stringify(
                request.query as any,
              )}`}
            >
              Télécharger les{' '}
              <span>{Array.isArray(projects) ? projects.length : projects.itemCount}</span> projets
              (document csv)
            </DownloadLink>
          </div>
          <ProjectList
            displayGF={true}
            projects={projects}
            role={request.user?.role}
            GFPastDue={garantiesFinancieres === 'pastDue'}
          />
        </>
      )}
    </LegacyPageTemplate>
  );
};

hydrateOnClient(GarantiesFinancieres);
