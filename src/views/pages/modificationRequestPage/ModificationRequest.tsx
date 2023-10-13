import { SuccessBox, ErrorBox, Heading1, Heading2, PrimaryButton, Form } from '@potentiel/ui';
import { ModificationRequestActionTitles, ProjectInfo, LegacyPageTemplate } from '../../components';
import { ModificationRequestPageDTO } from '../../../modules/modificationRequest';
import { userIs } from '../../../modules/users';
import ROUTES from '../../../routes';
import { Request } from 'express';
import moment from 'moment';
import React from 'react';
import { hydrateOnClient } from '../../helpers';
import {
  ActionnaireForm,
  AdminResponseForm,
  AdminRéponseDélaiForm,
  AnnulerDemandeDélaiBouton,
  CancelButton,
  DemandeDetails,
  DemandeStatus,
  ProducteurForm,
  PuissanceForm,
  RecoursForm,
} from './components';

moment.locale('fr');

type ModificationRequestProps = {
  request: Request;
  modificationRequest: ModificationRequestPageDTO;
};

export const ModificationRequest = ({ request, modificationRequest }: ModificationRequestProps) => {
  const { user } = request;
  const { error, success } = request.query as any;
  const { type, id, status } = modificationRequest;

  const userIsAdmin = userIs(['admin', 'dgec-validateur', 'dreal'])(user);

  const showFormulaireAdministrateur =
    userIsAdmin &&
    !modificationRequest.respondedOn &&
    !modificationRequest.cancelledOn &&
    status !== 'information validée';

  const showPasserEnInstructionButton =
    showFormulaireAdministrateur && type === 'delai' && status === 'envoyée';

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-requests">
      <Heading1>
        <ModificationRequestActionTitles action={type} />
      </Heading1>
      {error && <ErrorBox title={error} />}
      {success && <SuccessBox title={success} />}

      <div className="flex flex-col gap-5">
        <div>
          <Heading2>Concernant le projet</Heading2>
          <ProjectInfo project={modificationRequest.project} className="mb-3" />
        </div>

        <DemandeDetails modificationRequest={modificationRequest} className="mb-5" />
        <DemandeStatus role={user.role} modificationRequest={modificationRequest} />
        {showPasserEnInstructionButton && (
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
              confirmation='Êtes-vous sûr de vouloir passer le statut de la demande "en instruction" ?'
            >
              Passer le statut en instruction
            </PrimaryButton>
          </Form>
        )}

        {showFormulaireAdministrateur && (
          <div>
            <Heading2>Répondre à la demande</Heading2>

            <AdminResponseForm role={user.role} modificationRequest={modificationRequest}>
              {type === 'delai' && (
                <AdminRéponseDélaiForm modificationRequest={modificationRequest} />
              )}

              {type === 'recours' && <RecoursForm />}

              {type === 'puissance' && <PuissanceForm modificationRequest={modificationRequest} />}

              {type === 'actionnaire' && (
                <ActionnaireForm modificationRequest={modificationRequest} />
              )}
              {type === 'producteur' && (
                <ProducteurForm modificationRequest={modificationRequest} />
              )}
            </AdminResponseForm>
          </div>
        )}

        {userIs('porteur-projet')(user) &&
          (type === 'delai' ? (
            <AnnulerDemandeDélaiBouton
              status={status}
              id={id}
              route={
                modificationRequest.delayInMonths
                  ? ROUTES.ANNULER_DEMANDE_ACTION
                  : ROUTES.ANNULER_DEMANDE_DELAI
              }
            />
          ) : (
            <CancelButton status={status} id={id} />
          ))}
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(ModificationRequest);
