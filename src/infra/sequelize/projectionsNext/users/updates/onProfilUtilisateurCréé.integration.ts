import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import { resetDatabase } from '@infra/sequelize/helpers';
import { ProfilUtilisateurCréé } from '@modules/utilisateur';
import { User } from '@infra/sequelize/projectionsNext';
import onProfilUtilisateurCréé from './onProfilUtilisateurCréé';

describe(`Handler onProfilUtilisateurCréé`, () => {
  beforeEach(async () => await resetDatabase());
  const id = new UniqueEntityID().toString();
  const email = 'user@test.test';
  const prénom = 'prénom';
  const nom = 'nom';
  const role = 'ademe';
  describe(`Cas d'un utilisateur invité`, () => {
    it(`Etant donné un utilisateur ayant le statut 'invité',
    lorsqu'un événement ProfilUtilisateurCréé est émis pour ce même utilisateur,
    alors l'entrée existante dans la table devrait être mise à jour`, async () => {
      await User.create({ id, email, role, état: 'invité' });

      const événement = new ProfilUtilisateurCréé({
        payload: { prénom, nom, email, role, fonction: undefined },
      });

      await onProfilUtilisateurCréé(événement);

      const résultat = await User.findAll({ where: { email } });
      expect(résultat).toHaveLength(1);
      expect(résultat[0]).toMatchObject({
        id,
        email,
        fullName: 'prénom nom',
        role,
        état: 'créé',
        fonction: null,
      });
    });
  });
  describe(`Cas d'un utilisateur non invité`, () => {
    it(`Etant donné un porteur créant son compte sans invitation préalable,
    lorsqu'un événement ProfilUtilisateurCréé est émis pour cet utilisateur,
    alors une nouvelle ligne doit être ajoutée à la table Users`, async () => {
      const événement = new ProfilUtilisateurCréé({ payload: { prénom, nom, email, role } });

      await onProfilUtilisateurCréé(événement);

      const résultat = await User.findAll({ where: { email } });
      expect(résultat).toHaveLength(1);
      expect(résultat[0]).toMatchObject({
        email,
        fullName: 'prénom nom',
        role,
        état: 'créé',
        fonction: null,
      });
    });
  });
});
