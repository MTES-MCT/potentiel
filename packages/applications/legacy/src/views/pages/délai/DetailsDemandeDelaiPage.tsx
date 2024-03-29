import {
  ProjectInfo,
  SuccessBox,
  LegacyPageTemplate,
  ErrorBox,
  Heading1,
  Heading2,
  PrimaryButton,
  Form,
  Heading3,
  ExternalLink,
  DownloadLink,
  StatutDemandeModification,
  ChampsObligatoiresLégende,
  Label,
  Input,
  AlertBox,
} from '../../components';
import { DetailDemandeDelaiPageDTO } from '../../../modules/modificationRequest';
import { userIs } from '../../../modules/users';
import ROUTES from '../../../routes';
import { Request } from 'express';
import moment from 'moment';
import React from 'react';
import { ModificationRequestStatusTitle, afficherDate, hydrateOnClient } from '../../helpers';
import { format } from 'date-fns';
import { UploadResponseFile } from '../modificationRequestPage/components';

moment.locale('fr');

type DetailsDemandeDelai = {
  request: Request;
  modificationRequest: DetailDemandeDelaiPageDTO;
};

export const DetailsDemandeDelai = ({ request, modificationRequest }: DetailsDemandeDelai) => {
  const { user } = request;
  const { error, success } = request.query as any;
  const {
    id,
    respondedBy,
    respondedOn,
    cancelledBy,
    requestedBy,
    requestedOn,
    cancelledOn,
    cahierDesCharges,
    justification,
    project,
    status,
    delayInMonths,
    dateAchèvementDemandée,
    attachmentFile,
    acceptanceParams,
    responseFile,
    versionDate,
    délaiAccordéCorrigéLe,
    délaiAccordéCorrigéPar,
    dateAchèvementAprèsCorrectionDélaiAccordé,
  } = modificationRequest;

  const dateDemandée = dateAchèvementDemandée
    ? new Date(dateAchèvementDemandée)
    : delayInMonths
    ? new Date(
        new Date(project.completionDueOn).setMonth(
          new Date(project.completionDueOn).getMonth() + delayInMonths,
        ),
      )
    : null;

  const nouvelleDateAchèvementMinimale = new Date(project.completionDueOn).setDate(
    new Date(project.completionDueOn).getDate() + 1,
  );

  const afficherFormulaireRéponse =
    userIs(['admin', 'dgec-validateur', 'dreal'])(user) &&
    !respondedOn &&
    !cancelledOn &&
    status !== 'information validée';

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-requests">
      <Heading1>Je demande un délai supplémentaire</Heading1>

      {error && <ErrorBox title={error} />}
      {success && <SuccessBox title={success} />}

      <div className="flex flex-col gap-5">
        <div>
          <Heading2>Concernant le projet</Heading2>
          <ProjectInfo project={modificationRequest.project} className="mb-3" />
        </div>
        <div>
          <Heading2>Détail de la demande</Heading2>
          <Heading3 className="mb-2">Contexte</Heading3>
          <div>
            Demande de prolongation de délai déposée par{' '}
            <span className="font-bold">{requestedBy}</span> le{' '}
            <span className="font-bold">{afficherDate(requestedOn)}</span>
          </div>
          {cahierDesCharges && (
            <div>
              Instruction selon le cahier des charges{' '}
              {cahierDesCharges.type === 'initial'
                ? 'initial (en vigueur à la candidature)'
                : `${
                    cahierDesCharges.alternatif ? 'alternatif' : ''
                  } modifié rétroactivement et publié le ${cahierDesCharges.paruLe}`}{' '}
              (<ExternalLink href={cahierDesCharges.url}>voir le cahier des charges</ExternalLink>)
            </div>
          )}

          {justification && (
            <>
              <Heading3 className="mb-2">Explications du porteur de projet</Heading3>
              <p className="m-0 italic">{`"${justification}"`}</p>
            </>
          )}

          <Heading3 className="mb-2">Nouveau délai</Heading3>
          {['envoyée', 'en instruction'].includes(status) ? (
            <div>
              <span>
                La date d'achèvement théorique est au{' '}
                <b>{format(new Date(project.completionDueOn), 'dd/MM/yyyy')}</b>.
              </span>
              <br />
              {dateDemandée && (
                <span>
                  Le porteur demande un délai pour une nouvelle date limite d'achèvement au{' '}
                  <span className="font-bold">{afficherDate(dateDemandée)}</span>.
                </span>
              )}
            </div>
          ) : (
            <div>
              {delayInMonths && (
                <>
                  Le porteur a demandé un délai de{' '}
                  <span className="font-bold">{delayInMonths} mois</span>.
                </>
              )}
              {dateAchèvementDemandée && (
                <>
                  Le porteur a demandé un délai pour une nouvelle date d'achèvement le{' '}
                  <span className="font-bold">
                    {format(new Date(dateAchèvementDemandée), 'dd/MM/yyyy')}
                  </span>
                </>
              )}
            </div>
          )}

          {attachmentFile && (
            <div className="mt-4">
              <DownloadLink
                fileUrl={ROUTES.DOWNLOAD_PROJECT_FILE(attachmentFile.id, attachmentFile.filename)}
              >
                Télécharger la pièce-jointe à la demande
              </DownloadLink>
            </div>
          )}
        </div>
        <Heading3 className="m-0">Statut de la demande</Heading3>
        <StatutDemandeModification statutDemande={status}>
          <span className="font-bold">{ModificationRequestStatusTitle[status]}</span>{' '}
          {respondedOn && respondedBy && `par ${respondedBy} le ${afficherDate(respondedOn)}`}
          {cancelledOn && cancelledBy && `par ${cancelledBy} le ${afficherDate(cancelledOn)}`}
          {acceptanceParams?.delayInMonths && (
            <div>
              L'administration vous accorde un délai{' '}
              <b>de {acceptanceParams.delayInMonths} mois.</b> Votre date d'achèvement théorique est
              actuellement au <b>{afficherDate(project.completionDueOn)}</b>.
            </div>
          )}
          {acceptanceParams?.dateAchèvementAccordée && (
            <div>
              L'administration vous accorde un report de date limite d'achèvement au{' '}
              <span className="font-bold">
                {afficherDate(new Date(acceptanceParams.dateAchèvementAccordée))}
              </span>
              .
            </div>
          )}
          {délaiAccordéCorrigéLe &&
            délaiAccordéCorrigéPar &&
            dateAchèvementAprèsCorrectionDélaiAccordé && (
              <div className="mt-4">
                <div>
                  <span className="font-bold">Correction du délai accordé</span> par{' '}
                  {délaiAccordéCorrigéPar} le {afficherDate(new Date(délaiAccordéCorrigéLe))}
                </div>
                <div>
                  L'administration vous accorde un report de date limite d'achèvement au{' '}
                  <span className="font-bold">
                    {afficherDate(new Date(dateAchèvementAprèsCorrectionDélaiAccordé))}
                  </span>
                  .
                </div>
              </div>
            )}
          {responseFile && (
            <div className="mt-4">
              <DownloadLink
                fileUrl={ROUTES.DOWNLOAD_PROJECT_FILE(responseFile.id, responseFile.filename)}
              >
                Télécharger le courrier de réponse
              </DownloadLink>
            </div>
          )}
        </StatutDemandeModification>

        {afficherFormulaireRéponse && (
          <>
            {status !== 'en instruction' && (
              <Form
                method="post"
                action={ROUTES.ADMIN_PASSER_DEMANDE_DELAI_EN_INSTRUCTION({
                  modificationRequestId: modificationRequest.id,
                })}
              >
                <PrimaryButton
                  type="submit"
                  name="modificationRequestId"
                  value={modificationRequest.id}
                  confirmation='Êtes-vous sûr de vouloir passer la demande au statut "en instruction" ?'
                >
                  Passer le statut en instruction
                </PrimaryButton>
              </Form>
            )}

            <div>
              <Heading2>Répondre à la demande</Heading2>

              <AlertBox className="mb-4">
                Attention : les demandes de prolongation de délai aux motifs de l'application du{' '}
                <span className="font-bold">délai exceptionnel relatif à la crise du covid-19</span>{' '}
                (accordé par la note de la DGEC du 15 mai 2020 adressée à EDF OA), ou en lien avec
                les{' '}
                <span className="font-bold">
                  cahiers des charges modificatifs du 30 août 2022 ne doivent pas faire l'objet
                  d'une instruction
                </span>
                . Ces délais sont{' '}
                <span className="font-bold">appliqués automatiquement par Potentiel</span> dès lors
                que le projet est éligible à leur application.
              </AlertBox>

              <Form
                action={ROUTES.ADMIN_REPONDRE_DEMANDE_DELAI}
                method="post"
                encType="multipart/form-data"
              >
                <input type="hidden" name="modificationRequestId" value={modificationRequest.id} />
                <input type="hidden" name="type" value={modificationRequest.type} />
                <input type="hidden" name="versionDate" value={versionDate} />
                <ChampsObligatoiresLégende className="mb-3" />
                <UploadResponseFile modificationRequest={modificationRequest} />

                <div className="mt-4 mb-4">
                  <Label htmlFor="dateAchevementAccordee">Date limite d'achèvement accordée</Label>
                  <Input
                    type="date"
                    name="dateAchevementAccordee"
                    id="dateAchevementAccordee"
                    {...(dateDemandée && {
                      defaultValue: format(dateDemandée, 'yyyy-MM-dd'),
                    })}
                    min={format(nouvelleDateAchèvementMinimale, 'yyyy-MM-dd')}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <PrimaryButton
                    type="submit"
                    name="submitAccept"
                    confirmation={`Êtes-vous sur de vouloir accepter la demande de délai ?`}
                  >
                    Accepter la demande
                  </PrimaryButton>
                  <PrimaryButton
                    className="bg-red-marianne-425-base hover:bg-red-marianne-425-hover focus:bg-red-marianne-425-active block"
                    type="submit"
                    confirmation={`Êtes-vous sur de vouloir rejeter la demande de délai ?`}
                    name="submitRefuse"
                  >
                    Rejeter la demande
                  </PrimaryButton>
                </div>
              </Form>
            </div>
          </>
        )}
        {userIs('porteur-projet')(user) && ['envoyée', 'en instruction'].includes(status) && (
          <Form
            action={
              modificationRequest.delayInMonths
                ? ROUTES.ANNULER_DEMANDE_ACTION
                : ROUTES.ANNULER_DEMANDE_DELAI
            }
            method="post"
            className="m-0"
          >
            <input type="hidden" name="modificationRequestId" value={id} />
            <input type="hidden" name="type" value="delai" />

            <PrimaryButton
              className="w-fit"
              type="submit"
              name="submit"
              confirmation={`Êtes-vous sûr de vouloir annuler cette demande de délai ?`}
            >
              Annuler la demande
            </PrimaryButton>
          </Form>
        )}
        {status === 'rejetée' && userIs(['admin', 'dgec-validateur', 'dreal'])(user) && (
          <Form
            method="post"
            action={ROUTES.ADMIN_ANNULER_DELAI_REJETE({
              modificationRequestId: id,
            })}
            className="mt-4"
          >
            <PrimaryButton
              type="submit"
              value={modificationRequest.id}
              name={'modificationRequestId'}
              confirmation='Êtes-vous sûr de vouloir repasser la demande en statut "envoyée" ?'
            >
              Annuler le rejet de la demande
            </PrimaryButton>
          </Form>
        )}
        {/* {!délaiAccordéCorrigéLe &&
          status === 'acceptée' &&
          userIs(['admin', 'dgec-validateur', 'dreal'])(user) && (
            <div>
              <LinkButton href={ROUTES.GET_CORRIGER_DELAI_ACCORDE_PAGE(id)}>
                Corriger le délai accordé
              </LinkButton>
            </div>
          )} */}
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(DetailsDemandeDelai);
