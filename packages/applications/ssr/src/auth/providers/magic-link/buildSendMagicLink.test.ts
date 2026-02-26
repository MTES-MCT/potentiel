import { before, describe, test } from 'node:test';
import assert from 'node:assert';

import { SendEmailV2 } from '@potentiel-applications/notifications';
import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { TrouverUtilisateurReadModel, Utilisateur } from '@potentiel-domain/utilisateur';
import { Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { GetUtilisateurFromEmail } from '@/auth/getUtilisateurFromEmail';

import { buildSendMagicLink } from './buildSendMagicLink';

type Utilisateur = PlainType<TrouverUtilisateurReadModel>;

const porteurDeProjet: Utilisateur = {
  rôle: { nom: 'porteur-projet' },
  identifiantUtilisateur: Email.convertirEnValueType('porteur@test.test'),
};

const porteurDeProjetDésactivé: Utilisateur = {
  rôle: { nom: 'porteur-projet' },
  identifiantUtilisateur: Email.convertirEnValueType('porteur.desactive@test.test'),
  désactivé: true,
};

const dgecValidateur: Utilisateur = {
  rôle: { nom: 'dgec-validateur' },
  identifiantUtilisateur: Email.convertirEnValueType('dgec-validateur@test.test'),
  nomComplet: '',
  fonction: '',
};

const adminDGEC: Utilisateur = {
  rôle: { nom: 'admin' },
  identifiantUtilisateur: Email.convertirEnValueType('dgec@test.test'),
};

const dreal: Utilisateur = {
  rôle: { nom: 'dreal' },
  identifiantUtilisateur: Email.convertirEnValueType('dreal@test.test'),
  région: { nom: 'Corse' },
};

const utilisateursExistants: ReadonlyArray<Utilisateur> = [
  porteurDeProjet,
  porteurDeProjetDésactivé,
  adminDGEC,
  dgecValidateur,
  dreal,
];

const fakeGetUtilisateurFromEmail: GetUtilisateurFromEmail = async (email) => {
  const utilisateur = utilisateursExistants.find(
    (utilisateur) => utilisateur.identifiantUtilisateur.email === email,
  );

  if (!utilisateur) {
    return Option.none;
  }

  return { ...Utilisateur.bind(utilisateur), désactivé: utilisateur.désactivé };
};

before(() => {
  process.env.BASE_URL = 'https://potentiel.beta.gouv.fr';
});

describe(`Envoyer un email avec un lien de connexion`, () => {
  const utilisateursPouvantSeConnecterParEmail = [
    {
      email: porteurDeProjet.identifiantUtilisateur.email,
      typeUtilisateur: 'un porteur de projet',
    },
    {
      email: 'porteur-de-projet-indexistant@test.test',
      typeUtilisateur: 'un porteur sans compte',
    },
  ];

  utilisateursPouvantSeConnecterParEmail.map(({ email, typeUtilisateur }) => {
    test(`
        Étant donné ${typeUtilisateur}
        Lorsque le système envoie un email de vérification
        Alors un email avec un lien de connexion vers l'application devrait lui être envoyé
    `, async () => {
      // Given
      let emailWasSent = false;
      const url = 'verification-request-url';

      const fakeSendEmail: SendEmailV2 = async (actual) => {
        const expected = {
          key: 'auth/lien-magique',
          recipients: [email],
          values: {
            url,
          },
        };

        assert.deepStrictEqual(
          actual,
          expected,
          `L'email avec le lien de connexion n'a pas été envoyé`,
        );
        emailWasSent = true;
      };

      // When
      const sendVerificationRequest = buildSendMagicLink({
        sendEmail: fakeSendEmail,
        getUtilisateurFromEmail: fakeGetUtilisateurFromEmail,
        isActifAgentsPublics: false,
      });
      await sendVerificationRequest({ email, url });

      // Then
      assert.strictEqual(emailWasSent, true);
    });
  });
});

describe(`Ne pas envoyer d'email avec un lien de connexion pour les utilisateurs qui doivent se connecter seulement avec ProConnect`, () => {
  const utilisateursNePouvantPasSeConnecterParEmail = [
    {
      email: adminDGEC.identifiantUtilisateur.email,
      typeUtilisateur: 'un administrateur DGEC',
    },
    {
      email: dgecValidateur.identifiantUtilisateur.email,
      typeUtilisateur: 'un validateur DGEC',
    },
    { email: dreal.identifiantUtilisateur.email, typeUtilisateur: 'une DREAL' },
  ];

  utilisateursNePouvantPasSeConnecterParEmail.map(({ email, typeUtilisateur }) => {
    test(`
            Étant donné ${typeUtilisateur}
            Lorsque le système envoie un email de vérification
            Alors un email expliquant qu'il faut se connecter avec ProConnect devrait être envoyé
            Mais aucun email avec un lien de connexion ne devrait être envoyé
        `, async () => {
      // Given
      let emailWasSent = false;
      const url = 'verification-request-url';

      const fakeSendEmail: SendEmailV2 = async (actual) => {
        const envoiEmailAvecLienDeConnexion = {
          key: 'auth/lien-magique',
          recipients: [email],
          values: {
            url,
          },
        };

        assert.notDeepStrictEqual(
          actual,
          envoiEmailAvecLienDeConnexion,
          `L'email avec le lien de connexion n'aurait pas dû être envoyé`,
        );

        const expected = {
          key: 'auth/proconnect-obligatoire',
          recipients: [email],
          values: {
            url: process.env.BASE_URL + Routes.Auth.signIn({ forceProConnect: true }),
          },
        };

        assert.deepStrictEqual(actual, expected);
        emailWasSent = true;
      };

      // When
      const sendVerificationRequest = buildSendMagicLink({
        sendEmail: fakeSendEmail,
        getUtilisateurFromEmail: fakeGetUtilisateurFromEmail,
        isActifAgentsPublics: false,
      });
      await sendVerificationRequest({ email, url });

      // Then
      assert.strictEqual(emailWasSent, true);
    });
  });
});

describe(`N'envoyer aucun email pour les utilisateurs désactivé`, () => {
  test(`
            Étant donné un utilisateur désactivé
            Lorsque le système envoie un email de vérification
            Alors aucun email ne devrait être envoyé
        `, async () => {
    // Given
    let emailWasSent = false;
    const email = porteurDeProjetDésactivé.identifiantUtilisateur.email;
    const url = 'verification-request-url';

    const fakeSendEmail: SendEmailV2 = async () => {
      emailWasSent = true;
    };

    // When
    const sendVerificationRequest = buildSendMagicLink({
      sendEmail: fakeSendEmail,
      getUtilisateurFromEmail: fakeGetUtilisateurFromEmail,
      isActifAgentsPublics: false,
    });
    await sendVerificationRequest({ email, url });

    // Then
    assert.strictEqual(emailWasSent, false, 'Aucun email ne devrait être envoyé');
  });
});
