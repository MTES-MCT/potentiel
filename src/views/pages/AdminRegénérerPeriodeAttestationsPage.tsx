import { Request } from 'express';
import React from 'react';
import { appelsOffreStatic } from '@dataAccess/inMemory';
import ROUTES from '@routes';
import {
  PrimaryButton,
  ErrorBox,
  Heading1,
  Input,
  Label,
  LegacyPageTemplate,
  Select,
  SuccessBox,
  TextArea,
  Form,
  InfoBox,
} from '@components';
import { hydrateOnClient, updateUrlParams } from '../helpers';

type AdminRegénérerPeriodeAttestationsProps = {
  request: Request;
};

export const AdminRegénérerPeriodeAttestations = ({
  request,
}: AdminRegénérerPeriodeAttestationsProps) => {
  const { error, success, appelOffreId, periodeId, familleId, notificationDate, reason } =
    (request.query as any) || {};

  const periodes = appelsOffreStatic.find((ao) => ao.id === appelOffreId)?.periodes;

  const familles = appelsOffreStatic
    .find((ao) => ao.id === appelOffreId)
    ?.familles.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <LegacyPageTemplate user={request.user} currentPage="regenerate-certificates">
      <Heading1>Regénérer des attestations</Heading1>
      <p>
        Cette page permet de relancer la génération d‘une attestation pour l‘intégralité des projets
        d‘une période. Cette fonction peut être utile lorsqu‘une erreur a pu être corrigée sur le
        modèle de l‘attestation ou dans les données relatives à un appel d‘offre.
      </p>

      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}

      <Form
        action={ROUTES.ADMIN_REGENERATE_CERTIFICATES_ACTION}
        method="post"
        className="max-w-none mx-0 mb-4"
      >
        <div>
          <Label htmlFor="appelOffreId">Appel d'offre concerné</Label>
          <Select
            name="appelOffreId"
            id="appelOffreId"
            defaultValue={appelOffreId || 'default'}
            onChange={(event) =>
              updateUrlParams({
                appelOffreId: event.target.value,
                periodeId: null,
                familleId: null,
                page: '1',
              })
            }
          >
            <option value="default" disabled hidden>
              Choisir un appel d‘offre
            </option>
            {appelsOffreStatic
              .filter((appelOffre) => appelOffre.id !== 'PPE2 - Bâtiment 2')
              .map((appelOffre) => (
                <option key={`appel_${appelOffre.id}`} value={appelOffre.id}>
                  {appelOffre.shortTitle}
                </option>
              ))}
          </Select>
        </div>
        {appelOffreId && periodes && periodes.length > 0 && (
          <div>
            <Label htmlFor="periodeId">Période concernée</Label>
            <Select
              id="periodeId"
              name="periodeId"
              className="mb-4"
              defaultValue={periodeId || periodes[periodes.length - 1].id || 'default'}
              onChange={(event) =>
                updateUrlParams({
                  periodeId: event.target.value,
                  page: '1',
                })
              }
            >
              <option value="default" disabled hidden>
                Choisir une période
              </option>
              {periodes.map((periode) => (
                <option key={'appel_' + periode.id} value={periode.id}>
                  {periode.title}
                </option>
              ))}
            </Select>
          </div>
        )}
        {appelOffreId && familles && familles.length > 0 && (
          <div>
            <Label htmlFor="familleId">Famille concernée</Label>
            <Select
              id="familleId"
              name="familleId"
              defaultValue={familleId || 'default'}
              onChange={(event) =>
                updateUrlParams({
                  familleId: event.target.value,
                  page: '1',
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
        <div>
          <Label htmlFor="notificationDate">
            Nouvelle date de désignation (facultatif, format JJ/MM/AAAA)
          </Label>
          <Input
            type="text"
            name="notificationDate"
            id="notificationDate"
            defaultValue={notificationDate}
          />
          <ErrorBox className="hidden">
            Le format de la date saisie n’est pas conforme. Elle doit être de la forme JJ/MM/AAAA
            soit par exemple 25/05/2022 pour 25 Mai 2022.
          </ErrorBox>
        </div>
        <div>
          <Label htmlFor="reason">
            Message justificatif du changement (facultatif, sera inclus dans le mail aux porteurs de
            projet)
          </Label>
          <TextArea name="reason" id="reason" defaultValue={reason} />
        </div>
        <div>
          <InfoBox className="mb-2">
            Un email sera envoyé aux porteurs de projets pour leur signaler la mise à jour de leur
            attestation.{' '}
          </InfoBox>
          <PrimaryButton
            type="submit"
            name="submit"
            confirmation="Êtes-vous sur de vouloir regénérer les attestations pour tous les projets de cette période ?"
          >
            Regénérer les attestations des projets de cette période
          </PrimaryButton>
        </div>
      </Form>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(AdminRegénérerPeriodeAttestations);
