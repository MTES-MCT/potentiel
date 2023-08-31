import {
  BarreDeRecherche,
  PrimaryButton,
  Heading1,
  Input,
  Label,
  ListeVide,
  ProjectList,
  Select,
  Form,
  LinkButton,
  ArrowLeftIcon,
  ArrowRightIcon,
  SecondaryLinkButton,
  PageListeTemplate,
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

  const hasFilters = !!(classement || recherche || appelOffreId || periodeId);

  const [formOpen, setFormOpen] = useState(true);

  return (
    <PageListeTemplate
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
      <PageListeTemplate.TopBar success={success} error={error}>
        <div className="flex gap-4 order-2 mt-8 lg:mt-0 lg:order-1">
          <LinkButton
            onClick={() => setFormOpen(!formOpen)}
            className="hidden lg:flex items-center w-fit show text-sm cursor-pointer"
          >
            {formOpen ? (
              <>
                <ArrowLeftIcon aria-hidden className="!text-white w-5 h-5 mr-2" />
                Masquer le formulaire
              </>
            ) : (
              <>
                Afficher le formulaire
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
          action={ROUTES.GET_NOTIFIER_CANDIDATS()}
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
      <PageListeTemplate.SideBar open={formOpen}>
        <Form action={ROUTES.POST_NOTIFIER_CANDIDATS} method="post">
          <div>
            <Label htmlFor="appelOffreId">Appel d'offre concerné</Label>
            <Select
              name="appelOffreId"
              id="appelOffreId"
              defaultValue={données && données.AOSélectionné ? données.AOSélectionné : 'default'}
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
              {données &&
                données.listeAOs.map((appelOffreId) => (
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
              defaultValue={
                données && données.périodeSélectionnée ? données.périodeSélectionnée : 'default'
              }
              onChange={(event) =>
                updateUrlParams({
                  periodeId: event.target.value,
                })
              }
            >
              <option value="default" disabled hidden>
                Choisir une période
              </option>
              {données &&
                données.listePériodes &&
                données.listePériodes.map((periodeId) => (
                  <option key={`appel_${periodeId}`} value={periodeId}>
                    période {periodeId}
                  </option>
                ))}
            </Select>
          </div>

          {!success &&
            utilisateur.role === 'dgec-validateur' &&
            données &&
            données.projetsPériodeSélectionnée.itemCount > 0 && (
              <>
                <div>
                  <Label htmlFor="notificationDate">Date désignation (format JJ/MM/AAAA)</Label>
                  <Input
                    type="text"
                    name="notificationDate"
                    id="notificationDate"
                    defaultValue={afficherDate(new Date())}
                  />
                </div>
                <PrimaryButton type="submit" name="submit" id="submit" className="mt-2">
                  Notifier{' '}
                  {données.projetsPériodeSélectionnée.itemCount === 1
                    ? 'le candidat '
                    : `les ${données.projetsPériodeSélectionnée.itemCount} candidats `}
                  de cette période
                </PrimaryButton>
              </>
            )}
        </Form>
        <Form action={ROUTES.GET_NOTIFIER_CANDIDATS()} method="GET" className="mt-4">
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
              <option value="default">Tous</option>
              <option value="classés" selected={classement && classement === 'classés'}>
                Classés
              </option>
              <option value="éliminés" selected={classement && classement === 'éliminés'}>
                Eliminés
              </option>
            </Select>
          </div>
        </Form>
      </PageListeTemplate.SideBar>
      <PageListeTemplate.List sideBarOpen={formOpen}>
        {données && données.projetsPériodeSélectionnée.items.length > 0 ? (
          <ProjectList
            projects={données.projetsPériodeSélectionnée}
            role={utilisateur?.role}
            currentUrl={currentUrl}
            exportListe={
              données.AOSélectionné && données.périodeSélectionnée
                ? {
                    title: ' Télécharger la liste des lauréats (document csv)',
                    url: `
                ${ROUTES.ADMIN_DOWNLOAD_PROJECTS_LAUREATS_CSV}?${querystring.stringify({
                      ...request.query,
                      appelOffreId: données.AOSélectionné,
                      periodeId: données.périodeSélectionnée,
                      beforeNotification: true,
                    })}`,
                  }
                : undefined
            }
          />
        ) : (
          <ListeVide titre="Aucun candidat à notifier" />
        )}
      </PageListeTemplate.List>
    </PageListeTemplate>
  );
};

hydrateOnClient(AdminNotificationCandidats);
