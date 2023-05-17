import {
  BarreDeRecherche,
  PrimaryButton,
  Dropdown,
  ErrorBox,
  ExcelFileIcon,
  Heading1,
  Input,
  Label,
  ListeVide,
  LegacyPageTemplate,
  ProjectList,
  SecondaryLinkButton,
  Select,
  SuccessBox,
} from '@components';
import { AppelOffre, Periode } from '@entities';
import { ProjectListItem } from '@modules/project/queries';
import ROUTES from '@routes';
import { Request } from 'express';
import querystring from 'querystring';
import React, { useState } from 'react';
import { PaginatedList } from '../../types';
import { afficherDate, hydrateOnClient, updateUrlParams } from '../helpers';

type AdminNotificationCandidatsProps = {
  request: Request;
  données?: {
    projetsPériodeSélectionnée: PaginatedList<ProjectListItem>;
    AOSélectionné: AppelOffre['id'];
    périodeSélectionnée: Periode['id'];
    listeAOs: Array<AppelOffre['id']>;
    listePériodes?: Array<Periode['id']>;
  };
};

export const AdminNotificationCandidats = ({
  request,
  données,
}: AdminNotificationCandidatsProps) => {
  const { error, success, recherche, classement } = (request.query as any) || {};

  if (!données) {
    // All projects have been notified
    return (
      <LegacyPageTemplate user={request.user} currentPage="notify-candidates">
        <Heading1>Notifier des candidats</Heading1>
        {success && <SuccessBox title={success} />}
        {error && <ErrorBox title={error} />}
        <ListeVide titre="Tous les candidats ont été notifiés" />
      </LegacyPageTemplate>
    );
  }

  const {
    projetsPériodeSélectionnée,
    AOSélectionné,
    périodeSélectionnée,
    listeAOs,
    listePériodes,
  } = données;

  const hasFilters = !!(classement && classement !== '');

  const [afficherFiltres, setAfficherFiltres] = useState(hasFilters);

  return (
    <LegacyPageTemplate user={request.user} currentPage="notify-candidates">
      <Heading1>Notifier les candidats</Heading1>
      {request.user.role !== 'dgec-validateur' && (
        <p>
          Seules les personnes ayant délégation de signature sont habilitées à notifier un appel
          d'offres. <br />
          Il est néanmoins possible de consulter les attestations qui seront envoyées aux porteurs
          de projets.
        </p>
      )}
      <form action={ROUTES.GET_NOTIFIER_CANDIDATS()} method="GET" className="ml-0 mb-4">
        <div className="form__group mt-5">
          <BarreDeRecherche name="recherche" className="pr-10" defaultValue={recherche || ''} />
        </div>

        <div className="form__group">
          <Dropdown
            design="link"
            text="Filtrer"
            isOpen={afficherFiltres}
            changeOpenState={(state) => setAfficherFiltres(state)}
            className="!w-full"
          >
            <div className="mt-4">
              <Label htmlFor="classement">Classés/Eliminés</Label>
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
          </Dropdown>
        </div>
      </form>
      <form action={ROUTES.POST_NOTIFIER_CANDIDATS} method="post" className="ml-0 mb-4">
        <div className="form__group">
          <Label htmlFor="appelOffreId" className="mt-4">
            Appel d'offre concerné
          </Label>
          <Select
            name="appelOffreId"
            id="appelOffreId"
            defaultValue={AOSélectionné || 'default'}
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
            {listeAOs.map((appelOffreId) => (
              <option key={`appel_${appelOffreId}`} value={appelOffreId}>
                Appel d'offres {appelOffreId}
              </option>
            ))}
          </Select>
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
                page: null,
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

          {AOSélectionné && périodeSélectionnée && (
            <div className="mt-4">
              <SecondaryLinkButton
                href={`
                ${ROUTES.ADMIN_DOWNLOAD_PROJECTS_LAUREATS_CSV}?${querystring.stringify({
                  ...request.query,
                  appelOffreId: AOSélectionné,
                  periodeId: périodeSélectionnée,
                  beforeNotification: true,
                })}`}
                download
              >
                <ExcelFileIcon className="mr-2" />
                Télécharger la liste des lauréats (document csv)
              </SecondaryLinkButton>
            </div>
          )}
        </div>
        {projetsPériodeSélectionnée.itemCount > 0 && !success && (
          <div className="form__group">
            <Label htmlFor="notificationDate">Date désignation (format JJ/MM/AAAA)</Label>
            <Input
              type="text"
              name="notificationDate"
              id="notificationDate"
              defaultValue={afficherDate(new Date())}
              className="w-auto"
            />
            {request.user?.role === 'dgec-validateur' && (
              <PrimaryButton type="submit" name="submit" id="submit" className="mt-4">
                Envoyer la notification aux {projetsPériodeSélectionnée.itemCount} candidats de
                cette période
              </PrimaryButton>
            )}
          </div>
        )}
      </form>

      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}
      <ProjectList projects={projetsPériodeSélectionnée} role={request.user?.role} />
    </LegacyPageTemplate>
  );
};

hydrateOnClient(AdminNotificationCandidats);
