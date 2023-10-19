import React from 'react';
import { Request } from 'express';
import { DemandeAbandonPageDTO } from '../../../modules/modificationRequest';
import { ModificationRequestStatusTitle, afficherDate, hydrateOnClient } from '../../helpers';
import { UtilisateurReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  ChampsObligatoiresLégende,
  DownloadLink,
  ErrorBox,
  ExternalLink,
  Form,
  Heading1,
  Heading2,
  Heading3,
  Input,
  Label,
  LegacyPageTemplate,
  PrimaryButton,
  ProjectInfo,
  SecondaryButton,
  StatutDemandeModification,
  SuccessBox,
} from '../../components';
import ROUTES from '../../../routes';

type DétailsAbandonProps = {
  request: Request;
  demandeAbandon: DemandeAbandonPageDTO;
};

export const DetailsAbandon = ({ request, demandeAbandon }: DétailsAbandonProps) => {
  const utilisateur = request.user as UtilisateurReadModel;
  const {
    requestedBy,
    requestedOn,
    justification,
    attachmentFile,
    cahierDesCharges,
    type,
    recandidature,
  } = demandeAbandon;
  const { error, success } = request.query as any;

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
        <div className="mb-5">
          <Heading2>Détail de la demande</Heading2>
          <Heading3 className="mb-2">Contexte</Heading3>
          <ul>
            <li>
              Demande déposée par <span className="font-bold">{requestedBy}</span> le{' '}
              <span className="font-bold">{afficherDate(requestedOn)}</span>
            </li>
            {cahierDesCharges && (
              <li>
                Instruction selon le cahier des charges{' '}
                {cahierDesCharges.type === 'initial'
                  ? 'initial (en vigueur à la candidature)'
                  : `${
                      cahierDesCharges.alternatif ? 'alternatif' : ''
                    } modifié rétroactivement et publié le ${cahierDesCharges.paruLe}`}{' '}
                (<ExternalLink href={cahierDesCharges.url}>voir le cahier des charges</ExternalLink>
                )
              </li>
            )}
            {type === 'abandon' && recandidature && (
              <li>
                Le projet s'inscrit dans un{' '}
                <span className="font-bold">contexte de recandidature</span>
              </li>
            )}
          </ul>
          <Heading3 className="mb-2">Explications du porteur de projet</Heading3>
          <p className="m-0 italic">{`"${justification || ''}"`}</p>
          {/* {type === 'abandon' && recandidature && (
            <>
              <AlertBox>
                <div className="font-bold">Demande d'abandon avec recandidature</div>
                <div>
                  <p className="m-0 mt-4">
                    Le porteur s'engage sur l'honneur à ne pas avoir débuté ses travaux au sens du
                    cahier des charges de l'AO associé et a abandonné son statut de lauréat au
                    profit d'une recandidature réalisée au plus tard le 31/12/2024. Il s'engage sur
                    l'honneur à ce que cette recandidature respecte les conditions suivantes :
                  </p>
                  <ul className="mb-0">
                    <li>
                      Que le dossier soit complet et respecte les conditions d'éligibilité du cahier
                      des charges concerné
                    </li>
                    <li>Le même lieu d'implantation que le projet abandonné</li>
                    <li>Une puissance équivalente à plus ou moins 20% que le projet abandonné</li>
                    <li>
                      Le tarif proposé ne doit pas être supérieur au prix plafond de la période dont
                      le projet était initialement lauréat, indexé jusqu’à septembre 2023 selon la
                      formule d’indexation du prix de référence indiquée dans le cahier des charges
                      concerné par la recandidature.
                    </li>
                  </ul>
                </div>
              </AlertBox>
            </>
          )} */}
        </div>
      </div>
      {attachmentFile && (
        <div className="mt-4">
          <DownloadLink
            fileUrl={ROUTES.DOWNLOAD_PROJECT_FILE(attachmentFile.id, attachmentFile.filename)}
          >
            Télécharger la pièce-jointe
          </DownloadLink>
        </div>
      )}

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
              fileUrl={ROUTES.DOWNLOAD_PROJECT_FILE(
                demandeAbandon.responseFile.id,
                demandeAbandon.responseFile.filename,
              )}
            >
              Télécharger le courrier de réponse
            </DownloadLink>
          </div>
        )}
      </StatutDemandeModification>
      {utilisateur.role === 'porteur-projet' && <RéponsePorteur abandon={demandeAbandon} />}
      {((!recandidature && ['admin', 'dgec-validateur'].includes(utilisateur.role)) ||
        (recandidature && ['dgec-validateur'].includes(utilisateur.role))) && (
        <RéponseValidateur abandon={demandeAbandon} />
      )}
    </LegacyPageTemplate>
  );
};

const RéponsePorteur = ({
  abandon: {
    status,
    id,
    project: { id: projectId },
  },
}: {
  abandon: DemandeAbandonPageDTO;
}) => (
  <>
    {status === 'en attente de confirmation' && (
      <Form action={ROUTES.CONFIRMER_DEMANDE_ABANDON} method="post" className="m-0">
        <input type="hidden" name="demandeAbandonId" value={id} />
        <input type="hidden" name="projectId" value={projectId} />
        <PrimaryButton type="submit" className="mt-4 mr-4">
          Je confirme ma demande
        </PrimaryButton>
      </Form>
    )}
    {['envoyée', 'en instruction', 'en attente de confirmation'].includes(status) && (
      <Form action={ROUTES.ANNULER_ABANDON} method="post" className="mt-2">
        <input type="hidden" name="modificationRequestId" value={id} />
        <input type="hidden" name="projectId" value={projectId} />

        <SecondaryButton
          className="w-fit mt-4 mr-4"
          type="submit"
          name="submit"
          confirmation="Êtes-vous sur de vouloir annuler cette demande ?"
        >
          Annuler la demande
        </SecondaryButton>
      </Form>
    )}
  </>
);

const RéponseValidateur = ({
  abandon: {
    status,
    id,
    versionDate,
    project,
    type,
    recandidature,
    project: { id: projectId },
  },
}: {
  abandon: DemandeAbandonPageDTO;
}) => (
  <>
    {status === 'rejetée' && (
      <Form method="post" action={ROUTES.ADMIN_ANNULER_ABANDON_REJETE} className="m-0 mt-4">
        <input type="hidden" name="projectId" value={projectId} />
        <SecondaryButton
          type="submit"
          value={id}
          name="demandeAbandonId"
          confirmation='Êtes-vous sûr de vouloir repasser la demande en statut "envoyée" ?'
        >
          Annuler le rejet de la demande
        </SecondaryButton>
      </Form>
    )}

    {status !== 'rejetée' && status !== 'acceptée' && (
      <>
        <Heading2>Répondre</Heading2>
        <Form
          action={ROUTES.ADMIN_REPONDRE_DEMANDE_ABANDON}
          method="post"
          encType="multipart/form-data"
        >
          <ChampsObligatoiresLégende />

          <input type="hidden" name="modificationRequestId" value={id} />
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="versionDate" value={versionDate} />
          <input type="hidden" name="projectId" value={projectId} />

          {recandidature && <input type="hidden" name="recandidature" value="true" />}
          {!recandidature && (
            <>
              <div className="mb-4">
                <DownloadLink
                  className="block mb-2"
                  fileUrl={ROUTES.TELECHARGER_MODELE_REPONSE(project, id)}
                >
                  Télécharger un modèle de réponse (document word/docx)
                </DownloadLink>
                <Label htmlFor="file">Réponse signée (fichier pdf)</Label>
                <Input type="file" name="file" id="file" required={true} aria-required={true} />
              </div>
            </>
          )}

          {!recandidature &&
            !['en attente de confirmation', 'demande confirmée'].includes(status) && (
              <PrimaryButton type="submit" name="submitConfirm" className="mt-2">
                Demander une confirmation au porteur de projet
              </PrimaryButton>
            )}

          <PrimaryButton
            type="submit"
            name="submitAccept"
            confirmation={`Êtes-vous sur de vouloir accepter la demande d'abandon ?`}
            className="mt-4 mr-4"
          >
            Accepter la demande d'abandon
          </PrimaryButton>
          {!recandidature && (
            <PrimaryButton
              className="bg-red-marianne-425-base hover:bg-red-marianne-425-hover focus:bg-red-marianne-425-active block mt-4"
              type="submit"
              confirmation={`Êtes-vous sur de vouloir rejeter la demande d'abandon ?`}
              name="submitRefuse"
            >
              Rejeter la demande d'abandon
            </PrimaryButton>
          )}
        </Form>
      </>
    )}
  </>
);

hydrateOnClient(DetailsAbandon);
