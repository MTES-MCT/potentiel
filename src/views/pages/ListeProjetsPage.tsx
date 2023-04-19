import { Request } from 'express';
import querystring from 'querystring';
import React, { useState } from 'react';
import { AppelOffre, Famille, Periode } from '@entities';
import { dataId } from '../../helpers/testId';
import ROUTES from '@routes';
import { PaginatedList } from '../../types';

import {
  ProjectList,
  ExcelFileIcon,
  SecondaryLinkButton,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  Button,
  Input,
  Label,
  Link,
  Heading1,
  BarreDeRecherche,
  ListeVide,
  Select,
} from '@components';
import { hydrateOnClient, resetUrlParams, updateUrlParams } from '../helpers';
import { ProjectListItem } from '@modules/project';
import { userIsNot } from '@modules/users';

type ListeProjetsProps = {
  request: Request;
  projects: PaginatedList<ProjectListItem>;
  appelsOffre: Array<AppelOffre>;
  existingAppelsOffres: Array<AppelOffre['id']>;
  existingPeriodes?: Array<Periode['id']>;
  existingFamilles?: Array<Famille['id']>;
};

export const ListeProjets = ({
  request,
  projects,
  appelsOffre,
  existingAppelsOffres,
  existingPeriodes,
  existingFamilles,
}: ListeProjetsProps) => {
  const {
    error,
    success,
    recherche,
    appelOffreId,
    periodeId,
    familleId,
    garantiesFinancieres,
    classement,
    reclames,
  } = (request.query as any) || {};

  const hasNonDefaultClassement =
    (request.user?.role === 'porteur-projet' && classement) ||
    (request.user &&
      ['admin', 'dreal', 'dgec-validateur'].includes(request.user?.role) &&
      classement !== 'classés');

  const hasFilters =
    appelOffreId || periodeId || familleId || garantiesFinancieres || hasNonDefaultClassement;

  const periodes = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.periodes.filter((periode) => !existingPeriodes || existingPeriodes.includes(periode.id));

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))
    .filter((famille) => !existingFamilles || existingFamilles.includes(famille.id));

  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [displaySelection, setDisplaySelection] = useState(false);
  const [afficherFiltres, setAfficherFiltres] = useState(false);

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>{request.user.role === 'porteur-projet' ? 'Mes Projets' : 'Projets'}</Heading1>
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}

          <form action={ROUTES.LISTE_PROJETS} method="GET" className="m-0 mb-6">
            <BarreDeRecherche
              placeholder="Rechercher par nom du projet"
              name="recherche"
              defaultValue={recherche || ''}
              className="mt-8"
            />

            <div className="mt-8 mb-6">
              <div
                onClick={() => setAfficherFiltres(!afficherFiltres)}
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
                  <title>{afficherFiltres ? `Fermer` : `Ouvrir`}</title>
                </svg>
              </div>
              <fieldset className="filter-panel mt-8">
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
                      defaultValue={periodeId}
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
                {[
                  'admin',
                  'dreal',
                  'dgec-validateur',
                  'porteur-projet',
                  'caisse-des-dépôts',
                ].includes(request.user.role) && (
                  <>
                    <Label htmlFor="garantiesFinancieres" className="mt-4">
                      Garanties financières
                    </Label>
                    <Select
                      id="garantiesFinancieres"
                      name="garantiesFinancieres"
                      defaultValue={garantiesFinancieres || 'default'}
                      onChange={(event) =>
                        updateUrlParams({
                          garantiesFinancieres: event.target.value,
                          page: null,
                        })
                      }
                    >
                      <option value="default" disabled hidden>
                        Choisir un état
                      </option>
                      <option value="">Toutes</option>
                      <option value="submitted">Déposées</option>
                      <option value="notSubmitted">Non-déposées</option>
                      <option value="pastDue">En retard</option>
                    </Select>
                  </>
                )}
                <Label htmlFor="classement" className="mt-4">
                  Projets Classés/Eliminés/Abandons
                </Label>
                <Select
                  id="classement"
                  name="classement"
                  defaultValue={classement || 'default'}
                  onChange={(event) =>
                    updateUrlParams({
                      classement: event.target.value,
                      page: null,
                    })
                  }
                >
                  <option value="default" disabled hidden>
                    Choisir un état
                  </option>
                  <option value="">Tous</option>
                  <option value="classés">Classés</option>
                  <option value="éliminés">Eliminés</option>
                  <option value="abandons">Abandons</option>
                </Select>

                {userIsNot('porteur-projet')(request.user) && (
                  <>
                    <Label htmlFor="reclames" className="mt-4">
                      Projets Réclamés/Non réclamés
                    </Label>
                    <Select
                      id="reclames"
                      name="reclames"
                      defaultValue={reclames || 'default'}
                      onChange={(event) =>
                        updateUrlParams({
                          reclames: event.target.value,
                        })
                      }
                    >
                      <option value="default" disabled hidden>
                        Choisir un état
                      </option>
                      <option value="">Tous</option>
                      <option value="réclamés">Réclamés</option>
                      <option value="non-réclamés">Non réclamés</option>
                    </Select>
                  </>
                )}
              </fieldset>
            </div>
            {hasFilters && (
              <Link href="#" onClick={resetUrlParams}>
                Retirer tous les filtres
              </Link>
            )}
          </form>
          {['admin', 'dgec-validateur', 'porteur-projet'].includes(request.user?.role) && (
            <div>
              <div onClick={() => setDisplaySelection(!displaySelection)} className="filter-toggle">
                <span
                  style={{
                    borderBottom: '1px solid var(--light-grey)',
                    paddingBottom: 5,
                  }}
                >
                  Donner accès à un utilisateur
                </span>
                <svg
                  className="icon filter-icon"
                  style={{ transform: displaySelection ? 'rotate(0deg)' : '' }}
                >
                  <use xlinkHref="#expand"></use>
                  <title>{displaySelection ? `Fermer` : `Ouvrir`} le formulaire</title>
                </svg>
              </div>
              {displaySelection && (
                <div>
                  <form
                    action={ROUTES.INVITE_USER_TO_PROJECT_ACTION}
                    method="POST"
                    name="form"
                    className="m-0 mt-4"
                  >
                    <select name="projectId" multiple hidden>
                      {selectedProjectIds.map((projectId) => (
                        <option selected key={projectId} value={projectId}>
                          {projectId}
                        </option>
                      ))}
                    </select>
                    <Label htmlFor="email" required>
                      Courrier électronique de la personne habilitée à suivre les projets
                      selectionnés ci-dessous:
                    </Label>
                    <Input
                      required
                      type="email"
                      name="email"
                      id="email"
                      {...dataId('email-field')}
                    />
                    <Button
                      className="mt-4"
                      type="submit"
                      name="submit"
                      id="submit"
                      disabled={!selectedProjectIds.length}
                    >
                      Accorder les droits sur {selectedProjectIds.length}{' '}
                      {selectedProjectIds.length > 1 ? 'projets' : 'projet'}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {projects.itemCount > 0 ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center py-2">
              <span>
                <strong>{projects.itemCount}</strong> projets
              </span>

              {projects.itemCount > 0 && (
                <SecondaryLinkButton
                  className="inline-flex items-center m-0 md:ml-auto umami--click--telecharger-un-export-projets"
                  href={`${ROUTES.EXPORTER_LISTE_PROJETS_CSV}?${querystring.stringify(
                    request.query as any,
                  )}`}
                  download
                >
                  <ExcelFileIcon className="mr-2" />
                  Télécharger un export
                </SecondaryLinkButton>
              )}
            </div>

            <ProjectList
              displaySelection={displaySelection}
              selectedIds={selectedProjectIds}
              onSelectedIdsChanged={setSelectedProjectIds}
              {...(request.user?.role === 'dreal' && { displayGF: true })}
              projects={projects}
              role={request.user?.role}
            />
          </>
        ) : (
          <ListeVide titre="Aucun projet à lister" />
        )}
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(ListeProjets);
