import { okAsync } from 'neverthrow';
import { NotificationArgs } from '../..';
import { UniqueEntityID } from '@core/domain';
import { AbandonAnnulé, AbandonAnnuléPayload } from '@modules/demandeModification';
import { makeOnAbandonAnnulé } from './onAbandonAnnulé';
import { UnwrapForTest } from '../../../../types';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { GetDataForStatutDemandeAbandonModifiéNotification } from '@modules/modificationRequest/queries';
import { makeUser } from '@entities';

describe('Handler onAbandonAnnulé', () => {
  it(`Etant donné une demande d'abandon en attente de confirmation
      Lorsque le porteur annule sa demande d'abandon
      Alors une notification devrait être envoyée à l'agent à l'origine de la demande de confirmation
      Et une notification devrait être envoyée au mail générique de la DGEC`, async () => {
    const demandeAbandonId = new UniqueEntityID().toString();
    const dgecEmail = 'dgec@test.test';
    const chargeAffaire = UnwrapForTest(
      makeUser(makeFakeUser({ role: 'admin', email: 'admin@test.test', fullName: 'admin1' })),
    );

    const getDataForStatutDemandeAbandonModifiéNotification: GetDataForStatutDemandeAbandonModifiéNotification =
      jest.fn(() =>
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

    expect(sendNotification).toHaveBeenCalledTimes(2);

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
  });
});
