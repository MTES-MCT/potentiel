import { Request } from 'express';
import querystring from 'querystring';
import React from 'react';
import routes from '../../../routes';
import { PaginatedList } from '../../../modules/pagination';
import { AppelOffre, Famille, Periode } from '@potentiel/domain-views';
import {
  SuccessBox,
  ErrorBox,
  LinkButton,
  Heading1,
  BarreDeRecherche,
  ListeVide,
  Label,
  Select,
  Form,
  DownloadLink,
} from '@potentiel/ui';
import { ProjectList, LegacyPageTemplate } from '../../components';
import { hydrateOnClient, resetUrlParams, updateUrlParams } from '../../helpers';
import { ProjectListItem } from '../../../modules/project/queries';
import { UtilisateurReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';

export type GarantiesFinancieresProps = {
  request: Request;
  projects: PaginatedList<ProjectListItem>;
  appelsOffre: Array<AppelOffre>;
  existingAppelsOffres: Array<AppelOffre['id']>;
  existingPeriodes?: Array<Periode['id']>;
  existingFamilles?: Array<Famille['id']>;
  currentUrl: string;
};

export const GarantiesFinancieres = ({
  request,
  projects,
  appelsOffre,
  existingAppelsOffres,
  existingPeriodes,
  existingFamilles,
  currentUrl,
}: GarantiesFinancieresProps) => {
  const {
    query: { error, success, recherche, appelOffreId, periodeId, familleId, garantiesFinancieres },
    user,
  } = (request as any) || {};

  const utilisateur = user as UtilisateurReadModel;

  const hasFilters = !!(appelOffreId || periodeId || familleId || garantiesFinancieres);

  const periodes = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.periodes.filter((periode) => !existingPeriodes || existingPeriodes.includes(periode.id));

  const familles = appelsOffre
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title))
    .filter((famille) => !existingFamilles || existingFamilles.includes(famille.id));

  return (
    <LegacyPageTemplate user={utilisateur} currentPage="list-garanties-financieres">
      <Heading1>Garanties financières</Heading1>

      <Form action={routes.ADMIN_GARANTIES_FINANCIERES} method="GET" className="m-0">
        <BarreDeRecherche
          placeholder="Rechercher par nom du projet"
          name="recherche"
          defaultValue={recherche || ''}
          className="mt-8"
        />
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
            <div>
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
          <div className="mt-4">
            <Label htmlFor="garantiesFinancieres">Statut des garanties financières</Label>
            <Select
              id="garantiesFinancieres"
              name="garantiesFinancieres"
              defaultValue=""
              onChange={(event) =>
                updateUrlParams({
                  garantiesFinancieres: event.target.value,
                })
              }
            >
              <option value="">Toutes</option>
              <option value="submitted">Déposées</option>
              <option value="notSubmitted">Non-déposées</option>
              <option value="pastDue">En retard</option>
            </Select>
          </div>
        </div>

        {hasFilters && (
          <LinkButton className="mt-[10px]" href="#" onClick={resetUrlParams}>
            Retirer tous les filtres
          </LinkButton>
        )}
      </Form>
      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}
      {projects.items.length === 0 ? (
        <ListeVide titre="Aucune garantie financière à lister" />
      ) : (
        <>
          <div className="mb-8 mt-4">
            <DownloadLink
              fileUrl={`${routes.EXPORTER_LISTE_PROJETS_CSV}?${querystring.stringify(
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
            role={utilisateur.role}
            GFPastDue={garantiesFinancieres === 'pastDue'}
            currentUrl={currentUrl}
            exportListe={{
              title: 'Télécharger un export (document csv)',
              url: `${routes.EXPORTER_LISTE_PROJETS_CSV}?${querystring.stringify(
                request.query as any,
              )}`,
            }}
          />
        </>
      )}
    </LegacyPageTemplate>
  );
};

hydrateOnClient(GarantiesFinancieres);
