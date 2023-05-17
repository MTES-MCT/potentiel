import { Request } from 'express';
import React from 'react';
import { appelsOffreStatic } from '@dataAccess/inMemory';
import { dataId } from '../../helpers/testId';
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
      <div className="panel__header">
        <Heading1>Regénérer des attestations</Heading1>
      </div>

      <p>
        Cette page permet de relancer la génération d‘une attestation pour l‘intégralité des projets
        d‘une période. Cette fonction peut être utile lorsqu‘une erreur a pu être corrigée sur le
        modèle de l‘attestation ou dans les données relatives à un appel d‘offre.
      </p>

      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}

      <form
        action={ROUTES.ADMIN_REGENERATE_CERTIFICATES_ACTION}
        method="post"
        style={{ maxWidth: 'auto', margin: '0 0 15px 0' }}
      >
        <div className="form__group">
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
                page: null,
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
          {appelOffreId && periodes && periodes.length > 0 && (
            <>
              <Label htmlFor="periodeId">Période concernée</Label>
              <Select
                id="periodeId"
                name="periodeId"
                className="mb-4"
                defaultValue={periodeId || periodes[periodes.length - 1].id || 'default'}
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
                {periodes.map((periode) => (
                  <option key={'appel_' + periode.id} value={periode.id}>
                    {periode.title}
                  </option>
                ))}
              </Select>
            </>
          )}
          {appelOffreId && familles && familles.length > 0 && (
            <>
              <Label htmlFor="familleId">Famille concernée</Label>
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
        </div>
        <div className="form__group">
          <Label htmlFor="notificationDate">
            Nouvelle date de désignation (facultatif, format JJ/MM/AAAA)
          </Label>
          <Input
            type="text"
            name="notificationDate"
            id="notificationDate"
            defaultValue={notificationDate}
            {...dataId('date-field')}
            style={{ width: 'auto' }}
          />
          <div
            className="notification error"
            style={{ display: 'none' }}
            {...dataId('error-message-wrong-format')}
          >
            Le format de la date saisie n’est pas conforme. Elle doit être de la forme JJ/MM/AAAA
            soit par exemple 25/05/2022 pour 25 Mai 2022.
          </div>
        </div>
        <div className="form__group">
          <Label htmlFor="reason">
            Message justificatif du changement (facultatif, sera inclus dans le mail aux porteurs de
            projet)
          </Label>
          <TextArea name="reason" id="reason" defaultValue={reason} />
        </div>

        <PrimaryButton
          className="mt-2"
          type="submit"
          name="submit"
          confirmation="Êtes-vous sur de vouloir regénérer les attestations pour tous les projets de cette période ?"
        >
          Regénérer les attestations des projets de cette période
        </PrimaryButton>
        <p>
          Un email sera envoyé aux porteurs de projets pour leur signaler la mise à jour de leur
          attestation.{' '}
        </p>
      </form>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(AdminRegénérerPeriodeAttestations);
