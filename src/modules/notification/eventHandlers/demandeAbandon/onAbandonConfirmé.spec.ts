import { describe, expect, it, jest } from '@jest/globals';
import { okAsync } from 'neverthrow';
import { NotificationArgs } from '../..';
import { UniqueEntityID } from '@core/domain';
import { makeUser } from '@entities';
import { UnwrapForTest } from '../../../../types';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { GetDataForStatutDemandeAbandonModifiéNotification } from '../../../modificationRequest';
import { makeOnAbandonConfirmé } from './onAbandonConfirmé';
import { AbandonConfirmé, AbandonConfirméPayload } from '@modules/demandeModification';

const demandeAbandonId = new UniqueEntityID().toString();

describe(`Handler onAbandonConfirmé`, () => {
  it(`Etant donné un projet avec deux utilisateurs porteur
      Et une demande d'abandon en attente de confirmation du porteur
      Lorsqu'un porteur confirme son souhait d'abandonner le projet
      Alors une notification devrait être envoyée au chargé d'affaire à l'origine de la demande de confirmation
      Et une notification devrait être envoyée au mail générique de la DGEC
      Et une notification devrait être envoyée à tous les porteurs du projet`, async () => {
    const chargeAffaire = UnwrapForTest(
      makeUser(makeFakeUser({ role: 'admin', email: 'admin@test.test', fullName: 'admin1' })),
    );

    const sendNotification = jest.fn(async (args: NotificationArgs) => null);

    const getDataForStatutDemandeAbandonModifiéNotification: GetDataForStatutDemandeAbandonModifiéNotification =
      jest.fn(() =>
        okAsync({
          chargeAffaire: { email: 'admin@test.test', fullName: 'admin1', id: chargeAffaire.id },
          nomProjet: 'nomProjet',
          appelOffreId: 'Eolien',
          périodeId: '1',
          départementProjet: 'departement',
          porteursProjet: [
            { email: 'porteur1@test.test', fullName: 'porteur1', id: 'ID1' },
            { email: 'porteur2@test.test', fullName: 'porteur2', id: 'ID2' },
          ],
        }),
      );

    await makeOnAbandonConfirmé({
      sendNotification,
      getDataForStatutDemandeAbandonModifiéNotification,
      dgecEmail: 'dgec@test.test',
    })(
      new AbandonConfirmé({
        payload: { demandeAbandonId, confirméPar: '' } as AbandonConfirméPayload,
      }),
    );

    expect(getDataForStatutDemandeAbandonModifiéNotification).toHaveBeenCalledWith(
      demandeAbandonId,
    );

    expect(sendNotification).toHaveBeenCalledTimes(4);

    expect(sendNotification).toHaveBeenCalledWith({
      type: 'modification-request-confirmed',
      message: {
        email: chargeAffaire.email,
        name: chargeAffaire.fullName,
        subject: `Demande d'abandon confirmée pour le projet ${'nomProjet'.toLowerCase()} (Eolien 1)`,
      },
      context: {
        modificationRequestId: demandeAbandonId,
        userId: chargeAffaire.id,
      },
      variables: {
        nom_projet: 'nomProjet',
        type_demande: 'abandon',
        modification_request_url: `/demande/${demandeAbandonId}/details.html`,
      },
    });

    expect(sendNotification).toHaveBeenCalledWith({
      type: 'modification-request-confirmed',
      message: {
        email: 'dgec@test.test',
        name: 'DGEC',
        subject: `Demande d'abandon confirmée pour le projet ${'nomProjet'.toLowerCase()} (Eolien 1)`,
      },
      context: {
        modificationRequestId: demandeAbandonId,
        userId: '',
      },
      variables: {
        nom_projet: 'nomProjet',
        type_demande: 'abandon',
        modification_request_url: `/demande/${demandeAbandonId}/details.html`,
      },
    });

    expect(sendNotification).toHaveBeenCalledWith({
      type: 'modification-request-status-update',
      message: {
        email: 'porteur1@test.test',
        name: 'porteur1',
        subject: `Votre demande de type abandon pour le projet nomProjet`,
      },
      context: {
        modificationRequestId: demandeAbandonId,
        userId: 'ID1',
      },
      variables: {
        nom_projet: 'nomProjet',
        type_demande: 'abandon',
        status: 'confirmé',
        modification_request_url: `/demande/${demandeAbandonId}/details.html`,
        document_absent: '', // injecting an empty string will prevent the default "with document" message to be injected in the email body
      },
    });

    expect(sendNotification).toHaveBeenCalledWith({
      type: 'modification-request-status-update',
      message: {
        email: 'porteur2@test.test',
        name: 'porteur2',
        subject: `Votre demande de type abandon pour le projet nomProjet`,
      },
      context: {
        modificationRequestId: demandeAbandonId,
        userId: 'ID2',
      },
      variables: {
        nom_projet: 'nomProjet',
        type_demande: 'abandon',
        status: 'confirmé',
        modification_request_url: `/demande/${demandeAbandonId}/details.html`,
        document_absent: '', // injecting an empty string will prevent the default "with document" message to be injected in the email body
      },
    });
  });
});
