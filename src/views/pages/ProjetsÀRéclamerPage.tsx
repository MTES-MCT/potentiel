import { Request } from 'express';
import React, { useState } from 'react';
import { Project } from '../../entities';
import { PaginatedList } from '../../modules/pagination';
import { AppelOffre, Famille, Periode } from '@potentiel/domain-views';
import {
  BarreDeRecherche,
  Dropdown,
  Heading1,
  InfoBox,
  Label,
  LinkButton,
  ListeVide,
  MissingOwnerProjectList,
  Select,
  Form,
  PageListeTemplate,
  Accordeon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SecondaryLinkButton,
} from '../components';
import { hydrateOnClient, resetUrlParams, updateUrlParams } from '../helpers';
import routes from '../../routes';

interface ProjetsÀRéclamerProps {
  request: Request;
  projects?: PaginatedList<Project>;
  appelsOffre: Array<AppelOffre>;
  existingAppelsOffres: Array<AppelOffre['id']>;
  existingPeriodes?: Array<Periode['id']>;
  existingFamilles?: Array<Famille['id']>;
  currentUrl: string;
}

export const ProjetsÀRéclamer = ({
  request,
  projects,
  appelsOffre,
  existingPeriodes,
  existingFamilles,
  currentUrl,
}: ProjetsÀRéclamerProps) => {
  const { error, success, recherche, appelOffreId, periodeId, familleId, classement } =
    (request.query as any) || {};

  const hasNonDefaultClassement =
    (request.user?.role === 'porteur-projet' && classement) ||
    (request.user &&
      ['admin', 'dreal', 'dgec-validateur'].includes(request.user?.role) &&
      classement !== 'classés');

  const hasFilters = !!(
    appelOffreId ||
    periodeId ||
    familleId ||
    hasNonDefaultClassement ||
    recherche
  );

  const periodes = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.periodes.filter((periode) => !existingPeriodes || existingPeriodes.includes(periode.id));
  const filtreParPériodeActif = appelOffreId && periodes && periodes.length > 0;

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))
    .filter((famille) => !existingFamilles || existingFamilles.includes(famille.id));
  const filtreParFamilleActif = appelOffreId && familles && familles.length > 0;

  const [displayHelp, showHelp] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <PageListeTemplate
      user={request.user}
      currentPage={'list-missing-owner-projects'}
      contentHeader={
        <Heading1 className="!text-white whitespace-nowrap">
          Projets à réclamer {projects && projects.itemCount > 0 && ` (${projects.itemCount})`}
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
          action={routes.USER_LIST_MISSING_OWNER_PROJECTS}
          method="GET"
          className="w-full order-1 lg:order-2 lg:ml-auto"
        >
          <BarreDeRecherche
            placeholder="Rechercher par nom projet, nom candidat, appel d'offres, période, région"
            name="recherche"
            defaultValue={recherche || ''}
            className="mt-8"
          />
        </Form>
      </PageListeTemplate.TopBar>
      <PageListeTemplate.SideBar open={filtersOpen}>
        <Accordeon title="Filtrer par appel d'offre" defaultOpen={!!appelOffreId}>
          <Form action={routes.USER_LIST_MISSING_OWNER_PROJECTS} method="GET">
            <div>
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
                  })
                }
              >
                <option value="default" disabled hidden>
                  Choisir un appel d‘offre
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
      </PageListeTemplate.SideBar>
      <PageListeTemplate.List sideBarOpen={filtersOpen}>
        {!projects || projects.items.length === 0 ? (
          <ListeVide titre="Aucun projet à afficher" />
        ) : (
          <>
            <InfoBox className="mb-4">
              Pour ajouter un projet en attente d'affectation à votre suivi de projets (onglet "Mes
              projets"), sélectionnez-le, qu’il vous soit pré-affecté ou non.
              <br />
              Pour les projets qui ne vous sont pas pré-affectés, veuillez saisir le prix de
              référence tel qu'il figure dans votre attestation de désignation, ainsi que le numéro
              CRE puis téléversez l’attestation de désignation.
              <Dropdown
                text="Où trouver mon numéro CRE sur mon attestation de désignation ?"
                design="link"
                changeOpenState={(state) => showHelp(state)}
                isOpen={displayHelp}
                className="mt-2"
              >
                <img
                  alt="Capture d'un exemple d'attestation de désignation indiquant où trouver le numéro CRE dans les référence du document."
                  src="/images/numeroCRE_tooltip.jpg"
                  className="mt-4 w-[700px]"
                />
              </Dropdown>
            </InfoBox>
            <MissingOwnerProjectList
              displayColumns={[
                'Projet',
                'Puissance',
                'Region',
                'Projet pre-affecte',
                'Prix',
                'N° CRE',
                'Attestation de designation',
              ]}
              projects={projects}
              user={request.user}
              currentUrl={currentUrl}
            />
          </>
        )}
      </PageListeTemplate.List>
    </PageListeTemplate>
  );
};

hydrateOnClient(ProjetsÀRéclamer);
