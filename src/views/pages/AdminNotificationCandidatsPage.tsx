import {
  BarreDeRecherche,
  PrimaryButton,
  ErrorBox,
  Heading1,
  Input,
  Label,
  ListeVide,
  ProjectList,
  Select,
  SuccessBox,
  Form,
  PageTemplate,
  LinkButton,
  ArrowLeftIcon,
  ArrowRightIcon,
  Accordeon,
} from '../components';
import { ProjectListItem } from '../../modules/project/queries';
import ROUTES from '../../routes';
import { AppelOffre, Periode } from '@potentiel/domain-views';
import { Request } from 'express';
import querystring from 'querystring';
import React, { useState } from 'react';
import { PaginatedList } from '../../modules/pagination';
import { afficherDate, hydrateOnClient, resetUrlParams, updateUrlParams } from '../helpers';
import { UtilisateurReadModel } from '../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { userIs } from '../../modules/users';

type AdminNotificationCandidatsProps = {
  request: Request;
  données?: {
    projetsPériodeSélectionnée: PaginatedList<ProjectListItem>;
    AOSélectionné: AppelOffre['id'];
    périodeSélectionnée: Periode['id'];
    listeAOs: Array<AppelOffre['id']>;
    listePériodes?: Array<Periode['id']>;
  };
  currentUrl: string;
};

export const AdminNotificationCandidats = ({
  request,
  données,
  currentUrl,
}: AdminNotificationCandidatsProps) => {
  const {
    query: { error, success, recherche, classement, appelOffreId, periodeId },
    user,
  } = (request as any) || {};

  const utilisateur = user as UtilisateurReadModel;

  if (!données) {
    return (
      <PageTemplate
        user={utilisateur}
        currentPage="notify-candidates"
        contentHeader={
          <Heading1 className="!text-white whitespace-nowrap">Notifier les candidats</Heading1>
        }
      >
        <ListeVide titre="Aucun candidat à notifier" />
      </PageTemplate>
    );
  }

  const {
    projetsPériodeSélectionnée,
    AOSélectionné,
    périodeSélectionnée,
    listeAOs,
    listePériodes,
  } = données;

  const hasFilters = !!(classement || recherche || appelOffreId || periodeId);

  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <PageTemplate
      user={utilisateur}
      currentPage="notify-candidates"
      contentHeader={
        <>
          <Heading1 className="!text-white whitespace-nowrap">Notifier les candidats</Heading1>
          {utilisateur.role !== 'dgec-validateur' && (
            <p className="text-white">
              Seules les personnes ayant délégation de signature sont habilitées à notifier un appel
              d'offres. <br />
              Il est néanmoins possible de consulter les attestations qui seront envoyées aux
              porteurs de projets.
            </p>
          )}
        </>
      }
    >
      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}

      <div className={`flex lg:items-end lg:justify-between`}>
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
        <Form action={ROUTES.GET_NOTIFIER_CANDIDATS()} method="GET" className="w-full lg:ml-auto">
          <BarreDeRecherche
            placeholder="Rechercher par nom de projet"
            name="recherche"
            defaultValue={recherche || ''}
          />
        </Form>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 mt-8">
        <div
          className={`flex flex-col max-w-xl ${
            filtersOpen ? 'lg:w-1/3 lg:self-start lg:sticky lg:top-10 lg:max-w-none' : 'lg:hidden'
          }`}
        >
          {hasFilters && (
            <LinkButton href="#" onClick={resetUrlParams} className="mb-4 self-center text-sm">
              Retirer tous les filtres
            </LinkButton>
          )}

          <Accordeon
            title="Filtrer par statut projet"
            defaultOpen={!!classement}
            className="max-w-xl"
          >
            <Form action={ROUTES.GET_NOTIFIER_CANDIDATS()} method="GET">
              <div>
                <Label htmlFor="classement">Classés/Eliminés</Label>
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
                    Choisir une option
                  </option>
                  <option value="">Tous</option>
                  <option value="classés" selected={classement && classement === 'classés'}>
                    Classés
                  </option>
                  <option value="éliminés" selected={classement && classement === 'éliminés'}>
                    Eliminés
                  </option>
                </Select>
              </div>
            </Form>
          </Accordeon>

          <Accordeon
            title="Filtrer par appel d'offre"
            defaultOpen={!!(AOSélectionné || périodeSélectionnée)}
            className="max-w-xl"
          >
            <Form action={ROUTES.GET_NOTIFIER_CANDIDATS()} method="GET">
              <div>
                <Label htmlFor="appelOffreId">Appel d'offre concerné</Label>
                <Select
                  name="appelOffreId"
                  id="appelOffreId"
                  defaultValue={AOSélectionné || 'default'}
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
                  {listeAOs.map((appelOffreId) => (
                    <option key={`appel_${appelOffreId}`} value={appelOffreId}>
                      Appel d'offres {appelOffreId}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="periodeId" className="mt-4">
                  Periode concernée
                </Label>
                <Select
                  name="periodeId"
                  id="periodeId"
                  defaultValue={périodeSélectionnée || 'default'}
                  onChange={(event) =>
                    updateUrlParams({
                      periodeId: event.target.value,
                    })
                  }
                >
                  <option value="default" disabled hidden>
                    Choisir une période
                  </option>
                  {listePériodes?.map((periodeId) => (
                    <option key={`appel_${periodeId}`} value={periodeId}>
                      période {periodeId}
                    </option>
                  ))}
                </Select>
              </div>
            </Form>
          </Accordeon>
        </div>

        <div className={filtersOpen ? 'lg:w-2/3' : 'lg:w-full'}>
          {!success && userIs('dgec-validateur')(utilisateur) && (
            <Form action={ROUTES.POST_NOTIFIER_CANDIDATS} method="post" className="mb-8 gap-6">
              <Input type="hidden" name="appelOffreId" value={appelOffreId || AOSélectionné} />
              <Input type="hidden" name="periodeId" value={periodeId || périodeSélectionnée} />

              <div>
                <Label htmlFor="notificationDate">Date désignation (format JJ/MM/AAAA)</Label>
                <Input
                  className="w-fit"
                  type="text"
                  name="notificationDate"
                  id="notificationDate"
                  defaultValue={afficherDate(new Date())}
                />
              </div>
              <PrimaryButton type="submit" name="submit" id="submit">
                Notifier les {projetsPériodeSélectionnée.itemCount} candidats de cette période
              </PrimaryButton>
            </Form>
          )}
          <ProjectList
            projects={projetsPériodeSélectionnée}
            role={utilisateur?.role}
            currentUrl={currentUrl}
            exportListe={
              AOSélectionné && périodeSélectionnée
                ? {
                    title: ' Télécharger la liste des lauréats (document csv)',
                    url: `
                ${ROUTES.ADMIN_DOWNLOAD_PROJECTS_LAUREATS_CSV}?${querystring.stringify({
                      ...request.query,
                      appelOffreId: AOSélectionné,
                      periodeId: périodeSélectionnée,
                      beforeNotification: true,
                    })}`,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </PageTemplate>
  );
};

hydrateOnClient(AdminNotificationCandidats);
