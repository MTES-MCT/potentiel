import { Request } from 'express';
import querystring from 'querystring';
import React, { useState } from 'react';
import { AppelOffre, Famille, Periode } from '@entities';
import { PaginatedList } from '@modules/pagination';

import {
  ProjectList,
  ExcelFileIcon,
  SecondaryLinkButton,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  PrimaryButton,
  Input,
  Label,
  Heading1,
  BarreDeRecherche,
  ListeVide,
  Select,
  Dropdown,
  LinkButton,
  Form,
  Link,
} from '@components';
import { hydrateOnClient, resetUrlParams, updateUrlParams } from '../helpers';
import { ProjectListItem } from '@modules/project';
import { userIsNot } from '@modules/users';
import routes from '@routes';

type ListeProjetsProps = {
  request: Request;
  projects: PaginatedList<ProjectListItem>;
  appelsOffre: Array<AppelOffre>;
  existingAppelsOffres: Array<AppelOffre['id']>;
  existingPeriodes?: Array<Periode['id']>;
  existingFamilles?: Array<Famille['id']>;
  currentUrl: string;
};

export const ListeProjets = ({
  request,
  projects,
  appelsOffre,
  existingAppelsOffres,
  existingPeriodes,
  existingFamilles,
  currentUrl,
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

  const hasFilters = !!(
    appelOffreId ||
    periodeId ||
    familleId ||
    garantiesFinancieres ||
    hasNonDefaultClassement
  );

  const periodes = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.periodes.filter((periode) => !existingPeriodes || existingPeriodes.includes(periode.id));

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))
    .filter((famille) => !existingFamilles || existingFamilles.includes(famille.id));

  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [displaySelection, setDisplaySelection] = useState(false);

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-projects">
      <div className="flex justify-between">
        <Heading1>
          {request.user.role === 'porteur-projet' ? 'Mes Projets' : 'Projets'}
          {projects.itemCount > 0 && ` (${projects.itemCount})`}
        </Heading1>
        {/* { && (
          <span className="ml-3 text-base font-bold">({projects.itemCount})</span>
        )} */}
        {projects.itemCount > 0 && (
          <SecondaryLinkButton
            className="inline-flex items-center m-0 md:ml-auto umami--click--telecharger-un-export-projets"
            href={`${routes.EXPORTER_LISTE_PROJETS_CSV}?${querystring.stringify(
              request.query as any,
            )}`}
            download
          >
            <ExcelFileIcon className="mr-2" />
            Télécharger un export (csv)
          </SecondaryLinkButton>
        )}
      </div>
      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}

      {projects.items.length > 0 ? (
        <>
          {['admin', 'dgec-validateur', 'porteur-projet'].includes(request.user?.role) && (
            <Dropdown
              design="link"
              text="Donner accès à un utilisateur"
              isOpen={displaySelection}
              changeOpenState={(state) => setDisplaySelection(state)}
            >
              <Form
                action={routes.INVITE_USER_TO_PROJECT_ACTION}
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
                <div>
                  <Label htmlFor="email" required>
                    Courrier électronique de la personne habilitée à suivre les projets selectionnés
                    ci-dessous:
                  </Label>
                  <Input required type="email" name="email" id="email" />
                </div>
                <PrimaryButton
                  type="submit"
                  name="submit"
                  id="submit"
                  disabled={!selectedProjectIds.length}
                >
                  Accorder les droits sur {selectedProjectIds.length}{' '}
                  {selectedProjectIds.length > 1 ? 'projets' : 'projet'}
                </PrimaryButton>
              </Form>
            </Dropdown>
          )}

          <Form
            action={routes.LISTE_PROJETS}
            method="GET"
            className="my-6 !flex-row flex-wrap !max-w-none justify-start"
          >
            <BarreDeRecherche
              title="Rechercher par nom du projet"
              name="recherche"
              defaultValue={recherche || ''}
            />

            <div>
              <Label htmlFor="appelOffreId" className="text-sm">
                Appel d'offre
              </Label>
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
                className="w-[200px] text-ellipsis"
              >
                <option value="default" disabled hidden>
                  Choisir
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
            </div>
            {appelOffreId && periodes && periodes.length > 0 && (
              <div>
                <Label htmlFor="periodeId" className="text-sm">
                  Période
                </Label>
                <Select
                  id="periodeId"
                  name="periodeId"
                  defaultValue={periodeId}
                  onChange={(event) =>
                    updateUrlParams({
                      periodeId: event.target.value,
                    })
                  }
                  className="w-[200px] text-ellipsis"
                >
                  <option value="default" disabled hidden>
                    Choisir
                  </option>
                  <option value="">Toutes périodes</option>
                  {periodes.map((periode) => (
                    <option key={`appel_${periode.id}`} value={periode.id}>
                      {periode.title}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            {appelOffreId && familles && familles.length > 0 && (
              <div>
                <Label htmlFor="familleId" className="text-sm">
                  Famille
                </Label>
                <Select
                  id="familleId"
                  name="familleId"
                  defaultValue={familleId || 'default'}
                  onChange={(event) =>
                    updateUrlParams({
                      familleId: event.target.value,
                    })
                  }
                  className="w-[200px] text-ellipsis"
                >
                  <option value="default" disabled hidden>
                    Choisir
                  </option>
                  <option value="">Toutes familles</option>
                  {familles.map((famille) => (
                    <option key={`appel_${famille.id}`} value={famille.id}>
                      {famille.title}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            {['admin', 'dreal', 'dgec-validateur', 'porteur-projet', 'caisse-des-dépôts'].includes(
              request.user.role,
            ) && (
              <div>
                <Label htmlFor="garantiesFinancieres" className="text-sm">
                  État de la garantie financière
                </Label>
                <Select
                  id="garantiesFinancieres"
                  name="garantiesFinancieres"
                  defaultValue={garantiesFinancieres || 'default'}
                  onChange={(event) =>
                    updateUrlParams({
                      garantiesFinancieres: event.target.value,
                    })
                  }
                  className="w-[200px] text-ellipsis"
                >
                  <option value="default" disabled hidden>
                    Choisir
                  </option>
                  <option value="">Toutes</option>
                  <option value="submitted">Déposées</option>
                  <option value="notSubmitted">Non-déposées</option>
                  <option value="pastDue">En retard</option>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="classement" className="text-sm">
                Statut du projet
              </Label>
              <Select
                id="classement"
                name="classement"
                defaultValue={classement || 'default'}
                onChange={(event) =>
                  updateUrlParams({
                    classement: event.target.value,
                  })
                }
                className="w-[200px] text-ellipsis"
              >
                <option value="default" disabled hidden>
                  Choisir
                </option>
                <option value="">Tous</option>
                <option value="classés">Classés</option>
                <option value="éliminés">Eliminés</option>
                <option value="abandons">Abandons</option>
              </Select>
            </div>
            {userIsNot('porteur-projet')(request.user) && (
              <div className="md:mt-0">
                <Label htmlFor="reclames" className="text-sm">
                  État du projet
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
                  className="w-[200px] text-ellipsis"
                >
                  <option value="default" disabled hidden>
                    Choisir un état
                  </option>
                  <option value="">Tous</option>
                  <option value="réclamés">Réclamés</option>
                  <option value="non-réclamés">Non réclamés</option>
                </Select>
              </div>
            )}
          </Form>
          {hasFilters && (
            <LinkButton href="#" onClick={resetUrlParams} className="mb-3">
              Retirer tous les filtres
            </LinkButton>
          )}

          <ProjectList
            displaySelection={displaySelection}
            selectedIds={selectedProjectIds}
            currentUrl={currentUrl}
            onSelectedIdsChanged={setSelectedProjectIds}
            {...(request.user?.role === 'dreal' && { displayGF: true })}
            projects={projects}
            role={request.user?.role}
          />
        </>
      ) : (
        <ListeVide titre="Aucun projet à lister">
          {projects.itemCount > 0 && <Link href={routes.LISTE_PROJETS}>Voir tout les projets</Link>}
        </ListeVide>
      )}
    </LegacyPageTemplate>
  );
};

hydrateOnClient(ListeProjets);
