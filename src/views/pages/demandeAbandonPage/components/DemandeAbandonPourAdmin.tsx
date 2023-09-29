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
  ChampsObligatoiresLégende,
  Label,
  Input,
} from '../../../components';
import { ModificationRequestStatusTitle, afficherDate } from '../../../helpers';
import { DemandeDetails } from '../../modificationRequestPage/components';

export const DemandeAbandonPourAdmin = ({
  demandeAbandon,
  utilisateur,
  success,
  error,
}: {
  demandeAbandon: DemandeAbandonPageDTO;
  utilisateur: UtilisateurReadModel;
  error?: string;
  success?: string;
}) => (
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
      </StatutDemandeModification>

      {demandeAbandon.status === 'rejetée' && (
        <Form method="post" action={routes.ADMIN_ANNULER_ABANDON_REJETE} className="m-0 mt-4">
          <SecondaryButton
            type="submit"
            value={demandeAbandon.id}
            name="demandeAbandonId"
            confirmation='Êtes-vous sûr de vouloir repasser la demande en statut "envoyée" ?'
          >
            Annuler le rejet de la demande
          </SecondaryButton>
        </Form>
      )}
      <Heading2>Répondre</Heading2>
      <Form
        action={routes.ADMIN_REPONDRE_DEMANDE_ABANDON}
        method="post"
        encType="multipart/form-data"
      >
        <ChampsObligatoiresLégende />

        <input type="hidden" name="modificationRequestId" value={demandeAbandon.id} />
        <input type="hidden" name="type" value={demandeAbandon.type} />
        <input type="hidden" name="versionDate" value={demandeAbandon.versionDate} />
        <input type="hidden" name="projectId" value={demandeAbandon.project.id} />

        {demandeAbandon.recandidature ? (
          <input type="hidden" name="recandidature" value="true" />
        ) : (
          <>
            <div className="mb-4">
              <DownloadLink
                className="block mb-2"
                fileUrl={routes.TELECHARGER_MODELE_REPONSE(
                  demandeAbandon.project,
                  demandeAbandon.id,
                )}
              >
                Télécharger un modèle de réponse (document word/docx)
              </DownloadLink>
              <Label htmlFor="file">Réponse signée (fichier pdf)</Label>
              <Input type="file" name="file" id="file" required={true} aria-required={true} />
            </div>
            {!['en attente de confirmation', 'demande confirmée'].includes(
              demandeAbandon.status,
            ) && (
              <PrimaryButton type="submit" name="submitConfirm" className="mt-2">
                Demander une confirmation au porteur de projet
              </PrimaryButton>
            )}
          </>
        )}

        <PrimaryButton
          type="submit"
          name="submitAccept"
          confirmation={`Êtes-vous sur de vouloir accepter la demande d'abandon ?`}
          className="mt-4 mr-4"
        >
          Accepter la demande d'abandon
        </PrimaryButton>
        <PrimaryButton
          className="bg-red-marianne-425-base hover:bg-red-marianne-425-hover focus:bg-red-marianne-425-active block mt-4"
          type="submit"
          confirmation={`Êtes-vous sur de vouloir rejeter la demande d'abandon ?`}
          name="submitRefuse"
        >
          Rejeter la demande d'abandon
        </PrimaryButton>
      </Form>
    </div>
  </LegacyPageTemplate>
);
