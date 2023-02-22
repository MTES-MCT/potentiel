import { UserRightsToProjectRevoked } from '@modules/authZ';
import { Some } from '../../../../types';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { makeOnUserRightsToProjectRevoked } from './onUserRightsToProjectRevoked';

describe(`Handler onUserRightsToProjectRevoked`, () => {
  it(`Lorsqu'un événement ToutAccèsAuProjetRévoqué est émis,
    alors une notification devrait être envoyée au porteur`, async () => {
    const porteur = makeFakeUser({ id: 'user1' });

    const projetId = 'id-du-projet';
    const projet = makeFakeProject({ id: projetId });

    const getUser = jest.fn(async () => Some(porteur));
    const getProject = jest.fn(async () => projet);
    const notifierPorteurRévocationAccèsProjet = jest.fn();

    const onUserRightsToProjectRevoked = makeOnUserRightsToProjectRevoked({
      getUser,
      getProject,
      notifierPorteurRévocationAccèsProjet,
    });

    await onUserRightsToProjectRevoked(
      new UserRightsToProjectRevoked({
        payload: {
          projectId: projetId,
          userId: porteur.id,
          revokedBy: 'user-id',
        },
      }),
    );
    expect(notifierPorteurRévocationAccèsProjet).toHaveBeenCalledTimes(1);

    expect(notifierPorteurRévocationAccèsProjet).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        email: porteur.email,
        porteurId: porteur.id,
        nomProjet: projet.nomProjet,
      }),
    );
  });
});
