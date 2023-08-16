import { describe, expect, it, jest } from '@jest/globals';
import { okAsync } from 'neverthrow';
import { NotificationArgs } from '../..';
import { UniqueEntityID } from '../../../../core/domain';
import { AbandonAnnulé, AbandonAnnuléPayload } from '../../../demandeModification';
import { makeOnAbandonAnnulé } from './onAbandonAnnulé';
import { UnwrapForTest } from '../../../../types';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { GetDataForStatutDemandeAbandonModifiéNotification } from '../../../modificationRequest/queries';
import { makeUser } from '../../../../entities';

describe('Handler onAbandonAnnulé', () => {
  it(`Etant donné un projet avec deux utilisateurs porteur
      Et une demande d'abandon en attente de confirmation
      Lorsqu'un porteur annule la demande d'abandon
      Alors une notification devrait être envoyée à l'agent à l'origine de la demande de confirmation
      Et une notification devrait être envoyée au mail générique de la DGEC
      Et une notification devrait être envoyée à tous les porteurs du projet`, async () => {
    const demandeAbandonId = new UniqueEntityID().toString();
    const dgecEmail = 'dgec@test.test';
    const chargeAffaire = UnwrapForTest(
      makeUser(makeFakeUser({ role: 'admin', email: 'admin@test.test', fullName: 'admin1' })),
    );

    const getDataForStatutDemandeAbandonModifiéNotification =
      jest.fn<GetDataForStatutDemandeAbandonModifiéNotification>(() =>
        okAsync({
          chargeAffaire: {
            email: chargeAffaire.email,
            fullName: chargeAffaire.fullName,
            id: chargeAffaire.id,
          },
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

    const sendNotification = jest.fn(async (args: NotificationArgs) => null);
    await makeOnAbandonAnnulé({
      sendNotification,
      dgecEmail,
      getDataForStatutDemandeAbandonModifiéNotification,
    })(
      new AbandonAnnulé({
        payload: {
          demandeAbandonId,
          annuléPar: '',
        } as AbandonAnnuléPayload,
      }),
    );

    expect(sendNotification).toHaveBeenCalledTimes(4);

    expect(sendNotification).toHaveBeenCalledWith({
      type: 'modification-request-cancelled',
      message: {
        email: dgecEmail,
        name: 'DGEC',
        subject: "Demande d'abandon annulée pour le projet nomprojet (Eolien 1)",
      },
      context: {
        modificationRequestId: demandeAbandonId,
      },
      variables: {
        nom_projet: 'nomProjet',
        type_demande: 'abandon',
        departement_projet: 'departement',
        modification_request_url: `/demande/${demandeAbandonId}/details.html`,
      },
    });

    expect(sendNotification).toHaveBeenCalledWith({
      type: 'modification-request-cancelled',
      message: {
        email: chargeAffaire.email,
        name: chargeAffaire.fullName,
        subject: "Demande d'abandon annulée pour le projet nomprojet (Eolien 1)",
      },
      context: {
        modificationRequestId: demandeAbandonId,
      },
      variables: {
        nom_projet: 'nomProjet',
        type_demande: 'abandon',
        departement_projet: 'departement',
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
        status: 'annulé',
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
        status: 'annulé',
        modification_request_url: `/demande/${demandeAbandonId}/details.html`,
        document_absent: '', // injecting an empty string will prevent the default "with document" message to be injected in the email body
      },
    });
  });
});
