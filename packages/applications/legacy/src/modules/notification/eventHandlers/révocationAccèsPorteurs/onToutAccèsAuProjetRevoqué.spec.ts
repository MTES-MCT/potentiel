import { describe, expect, it, jest } from '@jest/globals';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { makeOnToutAccèsAuProjetRévoqué } from './onToutAccèsAuProjetRevoqué';
import { ToutAccèsAuProjetRevoqué } from '../../../authZ';
import { NotifierPorteurRévocationAccèsProjet } from '../../useCases';

describe(`Handler onToutAccèsAuProjetRevoqué`, () => {
  describe(`Etant donné un projet attaché à deux porteurs`, () => {
    it(`Lorsqu'un événement ToutAccèsAuProjetRévoqué est émis,
    alors une notification devrait être envoyée à chaque porteur dont les droits sont révoqués`, async () => {
      const porteur1 = makeFakeUser({ id: 'user1' });
      const porteur2 = makeFakeUser({ id: 'user2' });

      const projetId = 'id-du-projet';
      const projet = makeFakeProject({ id: projetId });

      const getProjectUsers = jest.fn(async () => [porteur1, porteur2]);
      const getProject = jest.fn(async () => projet);
      const notifierPorteurRévocationAccèsProjet = jest.fn<NotifierPorteurRévocationAccèsProjet>();

      const onToutAccèsAuProjetRevoqué = makeOnToutAccèsAuProjetRévoqué({
        getProjectUsers,
        getProject,
        notifierPorteurRévocationAccèsProjet,
      });

      await onToutAccèsAuProjetRevoqué(
        new ToutAccèsAuProjetRevoqué({
          payload: {
            projetId,
            cause: 'changement producteur',
          },
        }),
      );
      expect(notifierPorteurRévocationAccèsProjet).toHaveBeenCalledTimes(2);

      expect(notifierPorteurRévocationAccèsProjet).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          email: porteur1.email,
          porteurId: porteur1.id,
          nomProjet: projet.nomProjet,
        }),
      );

      expect(notifierPorteurRévocationAccèsProjet).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          email: porteur2.email,
          porteurId: porteur2.id,
          nomProjet: projet.nomProjet,
        }),
      );
    });
  });
});
