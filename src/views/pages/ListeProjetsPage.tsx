import { Request } from 'express';
import querystring from 'querystring';
import React, { useState } from 'react';

import { AppelOffre, Famille, Periode } from '@entities';
import { PaginatedList } from '@modules/pagination';

import {
  ProjectList,
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
  // Dropdown,
  LinkButton,
  Form,
  Link,
  Accordeon,
} from '@components';
import { hydrateOnClient, resetUrlParams, updateUrlParams } from '../helpers';
import { ProjectListItem } from '@modules/project';
import { userIsNot, userIs } from '@modules/users';
import routes from '@routes';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';

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
  const utilisateur = request.user as UtilisateurReadModel;

  if (projects.items.length === 0) {
    return (
      <>
        <LegacyPageTemplate user={utilisateur} currentPage="list-projects">
          <Heading1>{userIs('porteur-projet')(utilisateur) ? 'Mes Projets' : 'Projets'}</Heading1>
          <ListeVide titre="Aucun projet à lister">
            {projects.itemCount > 0 && (
              <Link href={routes.LISTE_PROJETS}>Voir tout les projets</Link>
            )}
          </ListeVide>
        </LegacyPageTemplate>
      </>
    );
  }

  const hasNonDefaultClassement =
    (userIs('porteur-projet')(utilisateur) && classement) ||
    (userIs(['admin', 'dreal', 'dgec-validateur'])(utilisateur) && classement !== 'classés');

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
    <LegacyPageTemplate user={utilisateur} currentPage="list-projects">
      <div className="flex justify-between">
        <Heading1>
          {utilisateur.role === 'porteur-projet' ? 'Mes Projets' : 'Projets'}
          {projects.itemCount > 0 && ` (${projects.itemCount})`}
        </Heading1>
      </div>
      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}

      <div className="flex flex-col lg:flex-row gap-10 mt-10">
        <div className="lg:w-1/3 lg:self-start lg:sticky lg:top-10">
          <Accordeon title="Filtrer la liste des projets">
            <Form action={routes.LISTE_PROJETS} method="GET" className="my-4">
              <BarreDeRecherche
                title="Rechercher par nom du projet"
                name="recherche"
                defaultValue={recherche || ''}
              />

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
                </div>
              )}
              {appelOffreId && familles && familles.length > 0 && (
                <div>
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
                </div>
              )}
              {userIs(['admin', 'dreal', 'dgec-validateur', 'porteur-projet', 'caisse-des-dépôts'])(
                utilisateur,
              ) && (
                <div>
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
                </div>
              )}
              <div className="flex-1 flex-shrink-0">
                <Label htmlFor="classement">Projets Classés/Eliminés/Abandons</Label>
                <Select
                  id="classement"
                  name="classement"
                  defaultValue={classement || 'default'}
                  onChange={(event) =>
                    updateUrlParams({
                      classement: event.target.value,
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
              </div>
              {userIsNot('porteur-projet')(utilisateur) && (
                <div className="flex-1 flex-shrink-0 mt-4 md:mt-0">
                  <Label htmlFor="reclames">Projets Réclamés/Non réclamés</Label>
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
                </div>
              )}
              {hasFilters && (
                <LinkButton href="#" onClick={resetUrlParams}>
                  Retirer tous les filtres
                </LinkButton>
              )}
            </Form>
          </Accordeon>
          {userIs(['admin', 'dgec-validateur', 'porteur-projet'])(utilisateur) && (
            <Accordeon
              title="Donner accès à un utilisateur"
              defaultOpen={displaySelection}
              changeVisibleState={(state) => setDisplaySelection(state)}
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
            </Accordeon>
          )}
        </div>

        <ProjectList
          className="lg:w-2/3"
          displaySelection={displaySelection}
          selectedIds={selectedProjectIds}
          currentUrl={currentUrl}
          onSelectedIdsChanged={setSelectedProjectIds}
          {...(userIs('dreal')(utilisateur) && { displayGF: true })}
          projects={projects}
          role={utilisateur.role}
          downloadUrl={`${routes.EXPORTER_LISTE_PROJETS_CSV}?${querystring.stringify(
            request.query as any,
          )}`}
        />
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(ListeProjets);
