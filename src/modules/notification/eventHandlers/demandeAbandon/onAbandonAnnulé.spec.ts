import { okAsync } from 'neverthrow';
import { NotificationArgs } from '../..';
import { UniqueEntityID } from '@core/domain';
import { GetModificationRequestInfoForStatusNotification } from '@modules/modificationRequest';
import { AbandonAnnulé, AbandonAnnuléPayload } from '@modules/demandeModification';
import { makeOnAbandonAnnulé } from './onAbandonAnnulé';

const demandeAbandonId = new UniqueEntityID().toString();
const dgecEmail = 'dgec@test.test';

describe('Handler onAbandonAnnulé', () => {
  describe('Etant donné un événement AbandonAnnulé émis', () => {
    const getModificationRequestInfo = jest.fn((() =>
      okAsync({
        porteursProjet: [],
        departementProjet: 'departement',
        regionProjet: '',
        nomProjet: 'nomProjet',
        type: 'abandon',
        evaluationCarboneDeRéférence: 100,
      })) as GetModificationRequestInfoForStatusNotification);

    const sendNotification = jest.fn(async (args: NotificationArgs) => null);

    it('should send en email to the DGEC', async () => {
      await makeOnAbandonAnnulé({
        sendNotification,
        dgecEmail,
        getModificationRequestInfo,
      })(
        new AbandonAnnulé({
          payload: {
            demandeAbandonId,
            annuléPar: '',
          } as AbandonAnnuléPayload,
        }),
      );

      expect(sendNotification).toHaveBeenCalledTimes(1);
      const notification = sendNotification.mock.calls[0][0];
      expect(notification).toMatchObject({
        type: 'modification-request-cancelled',
        message: {
          email: dgecEmail,
          name: 'DGEC',
        },
        context: {
          modificationRequestId: demandeAbandonId,
        },
        variables: {
          nom_projet: 'nomProjet',
          type_demande: 'abandon',
          departement_projet: 'departement',
        },
      });
    });
  });
});
