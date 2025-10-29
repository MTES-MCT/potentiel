import { before, describe, test } from 'node:test';
import assert from 'node:assert';

import { SendVerificationRequestParams } from 'next-auth/providers';

import { SendEmail } from '@potentiel-applications/notifications';
import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { TrouverUtilisateurReadModel, Utilisateur } from '@potentiel-domain/utilisateur';
import { Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { buildSendVerificationRequest } from './sendVerificationRequest';
import { GetUtilisateurFromEmail } from './getUtilisateur';

type Utilisateur = PlainType<TrouverUtilisateurReadModel>;

const porteurDeProjet: Utilisateur = {
  role: { nom: 'porteur-projet' },
  identifiantUtilisateur: Email.convertirEnValueType('porteur@test.test'),
};

const porteurDeProjetDésactivé: Utilisateur = {
  role: { nom: 'porteur-projet' },
  identifiantUtilisateur: Email.convertirEnValueType('porteur.desactive@test.test'),
  désactivé: true,
};

const dgecValidateur: Utilisateur = {
  role: { nom: 'dgec-validateur' },
  identifiantUtilisateur: Email.convertirEnValueType('dgec-validateur@test.test'),
  nomComplet: '',
  fonction: '',
};

const adminDGEC: Utilisateur = {
  role: { nom: 'admin' },
  identifiantUtilisateur: Email.convertirEnValueType('dgec@test.test'),
};

const dreal: Utilisateur = {
  role: { nom: 'dreal' },
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

const buildSendVerificationRequestParams = (
  identifier: string,
  url: string,
): SendVerificationRequestParams => {
  return {
    identifier,
    url,
    expires: new Date(),
    provider: {
      id: 'email',
      name: 'Email',
      type: 'email',
      server: '',
      from: '',
      maxAge: 1,
      sendVerificationRequest: () => Promise.resolve(),
      options: {},
    },
    token: '',
    theme: {},
  };
};

before(() => {
  process.env.BASE_URL = 'https://potentiel.beta.gouv.fr';
});

describe(`Envoyer un email avec un lien de connexion`, () => {
  const utilisateursPouvantSeConnecterParEmail = [
    {
      identifier: porteurDeProjet.identifiantUtilisateur.email,
      typeUtilisateur: 'un porteur de projet',
    },
    {
      identifier: 'porteur-de-projet-indexistant@test.test',
      typeUtilisateur: 'un porteur sans compte',
    },
  ];

  utilisateursPouvantSeConnecterParEmail.map(({ identifier, typeUtilisateur }) => {
    test(`
        Étant donné ${typeUtilisateur}
        Lorsque le système envoie un email de vérification
        Alors un email avec un lien de connexion vers l'application devrait lui être envoyé
    `, async () => {
      // Given
      let emailWasSent = false;
      const url = 'verification-request-url';

      const fakeSendEmail: SendEmail = async (actual) => {
        const expected = {
          templateId: 6785365,
          messageSubject: 'Connexion à Potentiel',
          recipients: [{ email: identifier, fullName: '' }],
          variables: {
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
      const sendVerificationRequest = buildSendVerificationRequest(
        fakeSendEmail,
        fakeGetUtilisateurFromEmail,
      );
      await sendVerificationRequest(buildSendVerificationRequestParams(identifier, url));

      // Then
      assert.strictEqual(emailWasSent, true);
    });
  });
});

describe(`Ne pas envoyer d'email avec un lien de connexion pour les utilisateurs qui doivent se connecter seulement avec ProConnect`, () => {
  const utilisateursNePouvantPasSeConnecterParEmail = [
    {
      identifier: adminDGEC.identifiantUtilisateur.email,
      typeUtilisateur: 'un administrateur DGEC',
    },
    {
      identifier: dgecValidateur.identifiantUtilisateur.email,
      typeUtilisateur: 'un validateur DGEC',
    },
    { identifier: dreal.identifiantUtilisateur.email, typeUtilisateur: 'une DREAL' },
  ];

  utilisateursNePouvantPasSeConnecterParEmail.map(({ identifier, typeUtilisateur }) => {
    test(`
            Étant donné ${typeUtilisateur}
            Lorsque le système envoie un email de vérification
            Alors un email expliquant qu'il faut se connecter avec ProConnect devrait être envoyé
            Mais aucun email avec un lien de connexion ne devrait être envoyé
        `, async () => {
      // Given
      let emailWasSent = false;
      const url = 'verification-request-url';

      const fakeSendEmail: SendEmail = async (actual) => {
        const envoiEmailAvecLienDeConnexion = {
          templateId: 6785365,
          messageSubject: 'Connexion à Potentiel',
          recipients: [{ email: identifier, fullName: '' }],
          variables: {
            url,
          },
        };

        assert.notDeepStrictEqual(
          actual,
          envoiEmailAvecLienDeConnexion,
          `L'email avec le lien de connexion n'aurait pas dû être envoyé`,
        );

        const expected = {
          templateId: 7103248,
          messageSubject: 'Potentiel - Connexion avec ProConnect obligatoire',
          recipients: [{ email: identifier, fullName: '' }],
          variables: {
            url: process.env.BASE_URL + Routes.Auth.signIn({ forceProConnect: true }),
          },
        };

        assert.deepStrictEqual(actual, expected);
        emailWasSent = true;
      };

      // When
      const sendVerificationRequest = buildSendVerificationRequest(
        fakeSendEmail,
        fakeGetUtilisateurFromEmail,
      );
      await sendVerificationRequest(buildSendVerificationRequestParams(identifier, url));

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
    const identifier = porteurDeProjetDésactivé.identifiantUtilisateur.email;
    const url = 'verification-request-url';

    const fakeSendEmail: SendEmail = async () => {
      emailWasSent = true;
    };

    // When
    const sendVerificationRequest = buildSendVerificationRequest(
      fakeSendEmail,
      fakeGetUtilisateurFromEmail,
    );
    await sendVerificationRequest(buildSendVerificationRequestParams(identifier, url));

    // Then
    assert.strictEqual(emailWasSent, false, 'Aucun email ne devrait être envoyé');
  });
});
