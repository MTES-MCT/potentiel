import {
  ModificationRequestActionTitles,
  ProjectInfo,
  SuccessBox,
  LegacyPageTemplate,
  ErrorBox,
  Heading1,
  Heading2,
} from '../../components';
import { ModificationRequestPageDTO } from '../../../modules/modificationRequest';
import { userIs } from '../../../modules/users';
import { Request } from 'express';
import moment from 'moment';
import React from 'react';
import { hydrateOnClient } from '../../helpers';
import {
  AdminResponseForm,
  CancelButton,
  DemandeDetails,
  DemandeStatus,
  ProducteurForm,
  PuissanceForm,
  PuissanceALaHausseInfoBox,
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

  const userIsDgec = userIs(['admin', 'dgec-validateur'])(user);
  const userIsDreal = userIs(['dreal'])(user);
  const isPendingModificationRequest =
    !modificationRequest.respondedOn &&
    !modificationRequest.cancelledOn &&
    status !== 'information validée';

  const showPuissanceInfoBox =
    type === 'puissance' &&
    userIsDreal &&
    modificationRequest.authority !== 'dreal' &&
    isPendingModificationRequest;

  const showFormulaireAdministrateur =
    (userIsDgec || (userIsDreal && modificationRequest.authority === 'dreal')) &&
    isPendingModificationRequest;

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

        {showPuissanceInfoBox && <PuissanceALaHausseInfoBox />}

        {showFormulaireAdministrateur && (
          <div>
            <Heading2>Répondre à la demande</Heading2>

            <AdminResponseForm role={user.role} modificationRequest={modificationRequest}>
              {type === 'puissance' && <PuissanceForm modificationRequest={modificationRequest} />}

              {type === 'producteur' && (
                <ProducteurForm modificationRequest={modificationRequest} />
              )}
            </AdminResponseForm>
          </div>
        )}

        {userIs('porteur-projet')(user) && <CancelButton status={status} id={id} />}
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(ModificationRequest);
