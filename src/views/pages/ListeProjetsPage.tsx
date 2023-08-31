import { Request } from 'express';
import querystring from 'querystring';
import React, { useState } from 'react';
import { PaginatedList } from '../../modules/pagination';
import { AppelOffre, Famille, Periode } from '@potentiel/domain-views';

import {
  ProjectList,
  PrimaryButton,
  Input,
  Label,
  Heading1,
  ListeVide,
  Select,
  LinkButton,
  Form,
  ArrowLeftIcon,
  ArrowRightIcon,
  BarreDeRecherche,
  Accordeon,
  Dropdown,
  SecondaryLinkButton,
  PageListeTemplate,
} from '../components';
import { hydrateOnClient, resetUrlParams, updateUrlParams } from '../helpers';
import { ProjectListItem } from '../../modules/project';
import { userIs, userIsNot } from '../../modules/users';
import routes from '../../routes';
import { UtilisateurReadModel } from '../../modules/utilisateur/récupérer/UtilisateurReadModel';

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

  const defaultClassementFilter =
    userIs(['admin', 'dreal', 'dgec-validateur'])(utilisateur) && classement === 'classés';

  const hasFilters = !!(
    appelOffreId ||
    periodeId ||
    familleId ||
    garantiesFinancieres ||
    recherche ||
    (classement && !defaultClassementFilter)
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

  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [displaySelection, setDisplaySelection] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const appelsOffreFiltre = appelsOffre.filter((appelOffre) =>
    existingAppelsOffres.includes(appelOffre.id),
  );

  return (
    <PageListeTemplate
      user={utilisateur}
      currentPage={'list-projects'}
      contentHeader={
        <Heading1 className="!text-white whitespace-nowrap">
          {utilisateur.role === 'porteur-projet' ? 'Mes Projets' : 'Projets'}
          {projects.itemCount > 0 && ` (${projects.itemCount})`}
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
          action={routes.LISTE_PROJETS}
          method="GET"
          className="w-full order-1 lg:order-2 lg:ml-auto"
        >
          <BarreDeRecherche
            placeholder="Rechercher par nom de projet"
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
          <Form action={routes.LISTE_PROJETS} method="GET">
            <div>
              <Label
                htmlFor="appelOffreId"
                disabled={appelsOffreFiltre.length === 0 ? true : undefined}
              >
                Appel d'offres concerné
              </Label>
              <Select
                id="appelOffreId"
                name="appelOffreId"
                defaultValue={appelOffreId || 'default'}
                disabled={appelsOffreFiltre.length === 0}
                onChange={(event) =>
                  updateUrlParams({
                    appelOffreId: event.target.value,
                    periodeId: null,
                    familleId: null,
                  })
                }
              >
                <option value="default" disabled hidden>
                  Choisir un appel d'offres
                </option>
                <option value="">Tous appels d'offres</option>
                {appelsOffreFiltre.map((appelOffre) => (
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
        {userIs(['admin', 'dreal', 'dgec-validateur', 'porteur-projet', 'caisse-des-dépôts'])(
          utilisateur,
        ) && (
          <Accordeon
            title="Filtrer par état des garanties financières"
            defaultOpen={!!garantiesFinancieres}
          >
            <Form action={routes.LISTE_PROJETS} method="GET">
              <div>
                <Label htmlFor="garantiesFinancieres">Garanties financières</Label>
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
            </Form>
          </Accordeon>
        )}
        <Accordeon
          title="Filtrer par état du projet"
          defaultOpen={defaultClassementFilter || classement}
        >
          <Form action={routes.LISTE_PROJETS} method="GET" className="mt-2">
            <div>
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
              <div className="mt-2">
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
          </Form>
        </Accordeon>
      </PageListeTemplate.SideBar>
      <PageListeTemplate.List sideBarOpen={filtersOpen}>
        {projects.items.length === 0 ? (
          <ListeVide titre="Aucun projet à lister" />
        ) : (
          <>
            {userIs(['admin', 'dgec-validateur', 'porteur-projet'])(utilisateur) && (
              <Dropdown
                design="link"
                isOpen={displaySelection}
                changeOpenState={(isOpen) => setDisplaySelection(isOpen)}
                text="Donner accès à un utilisateur"
                className={`mb-4 ${(success || error) && 'mt-4'}`}
              >
                <Form
                  action={routes.INVITE_USER_TO_PROJECT_ACTION}
                  method="POST"
                  name="form"
                  className="m-0"
                >
                  <select name="projectId" multiple hidden>
                    {selectedProjectIds.map((projectId) => (
                      <option selected key={projectId} value={projectId}>
                        {projectId}
                      </option>
                    ))}
                  </select>
                  <Label htmlFor="email" className="text-sm mt-2">
                    Merci de sélectionner les projets concernés et de renseigner le courrier
                    électronique de la personne habilitée à suivre les projets selectionnés
                  </Label>
                  <Input required type="email" name="email" id="email" className="!mt-0" />
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

            <ProjectList
              displaySelection={displaySelection}
              selectedIds={selectedProjectIds}
              currentUrl={currentUrl}
              onSelectedIdsChanged={setSelectedProjectIds}
              {...(userIs('dreal')(utilisateur) && { displayGF: true })}
              projects={projects}
              role={utilisateur.role}
              exportListe={{
                title: 'Télécharger un export (document csv)',
                url: `${routes.EXPORTER_LISTE_PROJETS_CSV}?${querystring.stringify(
                  request.query as any,
                )}`,
              }}
            />
          </>
        )}
      </PageListeTemplate.List>
    </PageListeTemplate>
  );
};

hydrateOnClient(ListeProjets);
