import assert from 'node:assert';
import { before, beforeEach, describe, mock, test } from 'node:test';

import type { SendEmail } from '@potentiel-applications/notifications';
import { Routes } from '@potentiel-applications/routes';
import { type TrouverUtilisateurReadModel, Utilisateur } from '@potentiel-domain/utilisateur';

import { buildSendMagicLink } from './buildSendMagicLink';

const utilisateurTest: TrouverUtilisateurReadModel = Utilisateur.bind({
  // le rôle n'a pas d'importance pour ce test car c'est peutUtiliserMagicLink qui détermine si l'utilisateur peut se connecter par lien magique ou pas
  rôle: { nom: 'porteur-projet' },
  identifiantUtilisateur: { email: 'test@test.test' },
});

const sendEmail = mock.fn<SendEmail>();
const url = 'verification-request-url';

before(() => {
  process.env.BASE_URL = 'https://potentiel.beta.gouv.fr';
});

beforeEach(() => {
  sendEmail.mock.resetCalls();
});

describe('buildSendMagicLink', () => {
  test(`Étant donné un utilisateur pouvant se connecter par lien magique
        Lorsque le système envoie un email de vérification
        Alors un email avec un lien de connexion vers l'application devrait lui être envoyé
      `, async () => {
    const email = utilisateurTest.identifiantUtilisateur.email;
    // When
    const sendVerificationRequest = buildSendMagicLink({
      sendEmail,
      getUtilisateurFromEmail: async () => utilisateurTest,
      peutUtiliserMagicLink: () => true,
    });
    await sendVerificationRequest({ email, url });

    // Then
    const expected = {
      key: 'auth/lien-magique',
      recipients: [email],
      values: {
        url,
      },
    };
    assert.strictEqual(sendEmail.mock.callCount(), 1);
    assert.deepEqual(sendEmail.mock.calls[0].arguments[0], expected);
  });

  test(`Étant donné un utilisateur ne pouvant pas se connecter par lien magique
        Lorsque le système envoie un email de vérification
        Alors un email expliquant qu'il faut se connecter avec ProConnect devrait être envoyé
        Mais aucun email avec un lien de connexion ne devrait être envoyé
          `, async () => {
    const email = utilisateurTest.identifiantUtilisateur.email;
    // When
    const sendVerificationRequest = buildSendMagicLink({
      sendEmail,
      getUtilisateurFromEmail: async () => utilisateurTest,
      peutUtiliserMagicLink: () => false,
    });
    await sendVerificationRequest({ email, url });

    // Then
    assert.strictEqual(sendEmail.mock.callCount(), 1);
    const expected = {
      key: 'auth/proconnect-obligatoire',
      recipients: [email],
      values: {
        url: process.env.BASE_URL + Routes.Auth.signIn({ forceProConnect: true }),
      },
    };
    assert.deepEqual(sendEmail.mock.calls[0].arguments[0], expected);
  });

  describe(`N'envoyer aucun email pour les utilisateurs désactivé`, () => {
    test(`
              Étant donné un utilisateur désactivé
              Lorsque le système envoie un email de vérification
              Alors aucun email ne devrait être envoyé
          `, async () => {
      // Given
      const email = utilisateurTest.identifiantUtilisateur.email;
      const utilisateurDésactivé: TrouverUtilisateurReadModel = {
        ...utilisateurTest,
        désactivé: true,
      };

      // When
      const sendVerificationRequest = buildSendMagicLink({
        sendEmail,
        getUtilisateurFromEmail: async () => utilisateurDésactivé,
        peutUtiliserMagicLink: () => true,
      });
      await sendVerificationRequest({ email, url });

      // Then
      assert.strictEqual(sendEmail.mock.callCount(), 0, 'Aucun email ne devrait être envoyé');
    });
  });
});
