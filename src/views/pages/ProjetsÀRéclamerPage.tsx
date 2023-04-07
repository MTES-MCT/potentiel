import { Request } from 'express';
import React, { useState } from 'react';
import { AppelOffre, Famille, Periode, Project } from '@entities';
import ROUTES from '@routes';
import { PaginatedList } from '../../types';
import {
  BarreDeRecherche,
  Dropdown,
  ErrorBox,
  Heading1,
  InfoBox,
  Label,
  LinkButton,
  ListeVide,
  MissingOwnerProjectList,
  PageTemplate,
  Select,
  SuccessBox,
} from '@components';
import { hydrateOnClient, resetUrlParams, updateUrlParams } from '../helpers';

interface ProjetsÀRéclamerProps {
  request: Request;
  projects?: PaginatedList<Project>;
  appelsOffre: Array<AppelOffre>;
  existingAppelsOffres: Array<AppelOffre['id']>;
  existingPeriodes?: Array<Periode['id']>;
  existingFamilles?: Array<Famille['id']>;
}

export const ProjetsÀRéclamer = ({
  request,
  projects,
  appelsOffre,
  existingAppelsOffres,
  existingPeriodes,
  existingFamilles,
}: ProjetsÀRéclamerProps) => {
  const { error, success, recherche, appelOffreId, periodeId, familleId, classement } =
    (request.query as any) || {};

  const hasNonDefaultClassement =
    (request.user?.role === 'porteur-projet' && classement) ||
    (request.user &&
      ['admin', 'dreal', 'dgec-validateur'].includes(request.user?.role) &&
      classement !== 'classés');

  const hasFilters = !!(appelOffreId || periodeId || familleId || hasNonDefaultClassement);

  const periodes = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.periodes.filter((periode) => !existingPeriodes || existingPeriodes.includes(periode.id));

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))
    .filter((famille) => !existingFamilles || existingFamilles.includes(famille.id));

  const [displayHelp, showHelp] = useState(false);
  const [afficherFiltres, setAfficherFiltres] = useState(hasFilters);

  return (
    <PageTemplate user={request.user} currentPage="list-missing-owner-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Projets à réclamer</Heading1>
          <InfoBox>
            Pour ajouter un projet en attente d'affectation à votre suivi de projets (onglet "Mes
            projets"), sélectionnez-le, qu’il vous soit pré-affecté ou non.
            <br />
            Pour les projets qui ne vous sont pas pré-affectés, veuillez saisir le prix de référence
            tel qu'il figure dans votre attestation de désignation, ainsi que le numéro CRE puis
            téléversez l’attestation de désignation.
            <Dropdown
              text="Où trouver mon numéro CRE sur mon attestation de désignation ?"
              design="link"
              changeOpenState={(state) => showHelp(state)}
              isOpen={displayHelp}
              className="mt-2"
            >
              <img src="/images/numeroCRE_tooltip.jpg" className="mt-4 w-[700px]" />
            </Dropdown>
          </InfoBox>
          <form
            action={ROUTES.USER_LIST_MISSING_OWNER_PROJECTS}
            method="GET"
            className="max-w-2xl lg:max-w-3xl mx-0 mb-6"
          >
            <BarreDeRecherche
              placeholder="Nom projet, nom candidat, appel d'offres, période, région"
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
              <fieldset className="mt-4">
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
                      <option key={`appel_${appelOffre.id}`} value={appelOffre.id}>
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
              </fieldset>
            </Dropdown>

            {hasFilters && (
              <LinkButton className="mt-[10px]" href="#" onClick={resetUrlParams}>
                Retirer tous les filtres
              </LinkButton>
            )}
          </form>
        </div>
        {success && <SuccessBox title={success} />}
        {error && (
          <ErrorBox>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </ErrorBox>
        )}
        {projects ? (
          <>
            <div className="m-2">
              <strong>{Array.isArray(projects) ? projects.length : projects.itemCount}</strong>{' '}
              projets
            </div>
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
            />
          </>
        ) : (
          <ListeVide titre="Aucun projet à afficher" />
        )}
      </div>
    </PageTemplate>
  );
};

hydrateOnClient(ProjetsÀRéclamer);
