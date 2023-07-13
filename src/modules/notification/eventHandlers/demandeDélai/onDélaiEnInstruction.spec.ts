import { okAsync } from '@core/utils';
import { DélaiEnInstruction } from '@modules/demandeModification';
import { makeOnDélaiEnInstruction } from './onDélaiEnInstruction';

describe(`Notifier lorsqu'un délai est accordé`, () => {
  describe(`Notifier les porteurs ayant accès au projet`, () => {
    it(`  Quand un délai est accordé
          Alors tous les porteurs ayant accès au projet devrait être notifié`, async () => {
      const sendNotification = jest.fn();
      const getModificationRequestInfoForStatusNotification = () =>
        okAsync({
          porteursProjet: [
            {
              role: 'porteur-projet',
              id: 'porteur-1',
              email: 'porteur1@test.test',
              fullName: 'Porteur de projet 1',
            },
            {
              role: 'porteur-projet',
              id: 'porteur-2',
              email: 'porteur2@test.test',
              fullName: 'Porteur de projet 2',
            },
          ],
          nomProjet: 'nom-du-projet',
          regionProjet: 'region',
          departementProjet: 'departement',
          type: 'delai',
          evaluationCarboneDeRéférence: 100,
        });

      const onDélaiEnInstruction = makeOnDélaiEnInstruction({
        sendNotification,
        getModificationRequestInfoForStatusNotification,
      });

      await onDélaiEnInstruction(
        new DélaiEnInstruction({
          payload: {
            demandeDélaiId: 'la-demande',
            projetId: 'le-projet',
            modifiéPar: 'la-dreal',
          },
        }),
      );

      expect(sendNotification).toHaveBeenCalledTimes(2);
      expect(sendNotification).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: 'modification-request-status-update',
          message: expect.objectContaining({
            email: 'porteur1@test.test',
          }),
          variables: expect.objectContaining({
            status: 'en instruction',
            nom_projet: 'nom-du-projet',
            type_demande: 'delai',
          }),
        }),
      );
      expect(sendNotification).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'modification-request-status-update',
          message: expect.objectContaining({
            email: 'porteur2@test.test',
          }),
          variables: expect.objectContaining({
            status: 'en instruction',
            nom_projet: 'nom-du-projet',
            type_demande: 'delai',
          }),
        }),
      );
    });
  });
});
