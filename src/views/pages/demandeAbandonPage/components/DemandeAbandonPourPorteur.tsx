import React from 'react';
import { DemandeAbandonPageDTO } from '../../../../modules/modificationRequest';
import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import routes from '../../../../routes';
import {
  LegacyPageTemplate,
  Heading1,
  ErrorBox,
  SuccessBox,
  Heading2,
  ProjectInfo,
  StatutDemandeModification,
  DownloadLink,
  Form,
  PrimaryButton,
  SecondaryButton,
} from '../../../components';
import { afficherDate, ModificationRequestStatusTitle } from '../../../helpers';
import { DemandeDetails } from '../../modificationRequestPage/components';

export const DemandeAbandonPourPorteur = ({
  demandeAbandon,
  utilisateur,
  success,
  error,
}: {
  demandeAbandon: DemandeAbandonPageDTO;
  utilisateur: UtilisateurReadModel;
  error?: string;
  success?: string;
}) => {
  return (
    <LegacyPageTemplate user={utilisateur} currentPage="list-requests">
      <Heading1>Je demande un abandon de mon projet</Heading1>
      {error && <ErrorBox title={error} />}
      {success && <SuccessBox title={success} />}

      <div className="flex flex-col gap-4">
        <div>
          <Heading2>Concernant le projet</Heading2>
          <ProjectInfo project={demandeAbandon.project} className="mb-3" />
        </div>
        <DemandeDetails modificationRequest={demandeAbandon} />
        <StatutDemandeModification statutDemande={demandeAbandon.status} className="my-4">
          <span className="font-bold">{ModificationRequestStatusTitle[demandeAbandon.status]}</span>{' '}
          {demandeAbandon.respondedOn &&
            demandeAbandon.respondedBy &&
            `par ${demandeAbandon.respondedBy} le ${afficherDate(demandeAbandon.respondedOn)}`}
          {demandeAbandon.cancelledOn &&
            demandeAbandon.cancelledBy &&
            `par ${demandeAbandon.cancelledBy} le ${afficherDate(demandeAbandon.cancelledOn)}`}
          {demandeAbandon.responseFile && demandeAbandon.status !== 'demande confirmée' && (
            <div className="mt-2">
              <DownloadLink
                fileUrl={routes.DOWNLOAD_PROJECT_FILE(
                  demandeAbandon.responseFile.id,
                  demandeAbandon.responseFile.filename,
                )}
              >
                Télécharger le courrier de réponse
              </DownloadLink>
            </div>
          )}
          {demandeAbandon.status === 'en attente de confirmation' && (
            <Form action={routes.CONFIRMER_DEMANDE_ABANDON} method="post" className="m-0">
              <input type="hidden" name="demandeAbandonId" value={demandeAbandon.id} />
              <PrimaryButton type="submit" className="mt-4">
                Je confirme ma demande
              </PrimaryButton>
            </Form>
          )}
        </StatutDemandeModification>
        {['envoyée', 'en instruction', 'en attente de confirmation'].includes(
          demandeAbandon.status,
        ) && (
          <Form action={routes.ANNULER_DEMANDE_ABANDON_ACTION} method="post" className="m-0">
            <input type="hidden" name="modificationRequestId" value={demandeAbandon.id} />

            <SecondaryButton
              className="w-fit"
              type="submit"
              name="submit"
              confirmation="Êtes-vous sur de vouloir annuler cette demande ?"
            >
              Annuler la demande
            </SecondaryButton>
          </Form>
        )}
      </div>
    </LegacyPageTemplate>
  );
};
