import { describe, expect, it, jest } from '@jest/globals';
import { okAsync } from '../../../../core/utils';
import { DélaiAccordéCorrigé } from '../../../demandeModification';
import { GetModificationRequestInfoForStatusNotification } from '../../../modificationRequest';
import { NotificationService } from '../../NotificationService';
import { makeOnDélaiAccordéCorrigé } from './onDélaiAccordéCorrigé';

describe(`Notifier les porteurs ayant accès au projet lorsqu'un délai est corrigé`, () => {
  it(`
      Etant donné un projet avec deux porteurs
      Quand un délai accordé est corrigé
      Alors les deux porteurs devraient être notifiés`, async () => {
    const sendNotification = jest.fn<NotificationService['sendNotification']>();
    const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification =
      () =>
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
          autorité: 'dgec',
          appelOffreId: 'Sol',
          périodeId: '1',
        });

    const onDélaiAccordéCorrigé = makeOnDélaiAccordéCorrigé({
      sendNotification,
      getModificationRequestInfoForStatusNotification,
    });

    await onDélaiAccordéCorrigé(
      new DélaiAccordéCorrigé({
        payload: {
          demandeDélaiId: 'la-demande',
          projectLegacyId: 'le-projet',
          dateAchèvementAccordée: new Date('2022-07-13').toISOString(),
          corrigéPar: 'la-dreal',
          ancienneDateThéoriqueAchèvement: new Date('2022-01-13').toISOString(),
          fichierRéponseId: 'fichier-id',
          identifiantProjet: 'Eolien#1#1#test1',
          explications: 'délai accordé deux fois',
        },
      }),
    );

    expect(sendNotification).toHaveBeenCalledTimes(2);
    expect(sendNotification).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'pp-délai-accordé-corrigé',
        message: expect.objectContaining({
          email: 'porteur1@test.test',
        }),
        variables: expect.objectContaining({
          nom_projet: 'nom-du-projet',
          explications: `Explications fournies par l'administration : "délai accordé deux fois".`,
        }),
      }),
    );
    expect(sendNotification).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'pp-délai-accordé-corrigé',
        message: expect.objectContaining({
          email: 'porteur2@test.test',
        }),
        variables: expect.objectContaining({
          nom_projet: 'nom-du-projet',
          explications: `Explications fournies par l'administration : "délai accordé deux fois".`,
        }),
      }),
    );
  });
});
