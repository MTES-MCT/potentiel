import assert from 'node:assert';
import { before, beforeEach, describe, mock, test } from 'node:test';

import type { SendEmail } from '@potentiel-applications/notifications';
import { Routes } from '@potentiel-applications/routes';
import { Email } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import { type TrouverUtilisateurReadModel, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import type { GetUtilisateurFromEmail } from '@/auth/getUtilisateurFromEmail';
import { buildSendMagicLink } from './buildSendMagicLink';

type UtilisateurItem = PlainType<TrouverUtilisateurReadModel>;

const porteurDeProjet: UtilisateurItem = {
  rôle: { nom: 'porteur-projet' },
  identifiantUtilisateur: Email.convertirEnValueType('porteur@test.test'),
};

const porteurDeProjetDésactivé: UtilisateurItem = {
  rôle: { nom: 'porteur-projet' },
  identifiantUtilisateur: Email.convertirEnValueType('porteur.desactive@test.test'),
  désactivé: true,
};

const dgecValidateur: UtilisateurItem = {
  rôle: { nom: 'dgec-validateur' },
  identifiantUtilisateur: Email.convertirEnValueType('dgec-validateur@test.test'),
  nomComplet: '',
  fonction: '',
};

const dgec: UtilisateurItem = {
  rôle: { nom: 'dgec' },
  identifiantUtilisateur: Email.convertirEnValueType('dgec@test.test'),
};

const dreal: UtilisateurItem = {
  rôle: { nom: 'dreal' },
  identifiantUtilisateur: Email.convertirEnValueType('dreal@test.test'),
  région: { nom: 'Corse' },
};

const cre: UtilisateurItem = {
  rôle: { nom: 'cre' },
  identifiantUtilisateur: Email.convertirEnValueType('cre@test.test'),
};

const ademe: UtilisateurItem = {
  rôle: { nom: 'ademe' },
  identifiantUtilisateur: Email.convertirEnValueType('ademe@test.test'),
};

const utilisateursExistants: ReadonlyArray<UtilisateurItem> = [
  porteurDeProjet,
  porteurDeProjetDésactivé,
  dgec,
  dgecValidateur,
  dreal,
  ademe,
  cre,
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
const sendEmail = mock.fn<SendEmail>();
const url = 'verification-request-url';

before(() => {
  process.env.BASE_URL = 'https://potentiel.beta.gouv.fr';
});

beforeEach(() => {
  sendEmail.mock.resetCalls();
});

describe(`Envoyer un email avec un lien de connexion`, () => {
  const utilisateursPouvantSeConnecterParMagicLink = [
    {
      email: porteurDeProjet.identifiantUtilisateur.email,
      typeUtilisateur: 'un porteur de projet',
    },
    {
      email: 'porteur-de-projet-inexistant@test.test',
      typeUtilisateur: 'un porteur sans compte',
    },
  ];

  utilisateursPouvantSeConnecterParMagicLink.forEach(({ email, typeUtilisateur }) => {
    test(`
        Étant donné ${typeUtilisateur}
        Lorsque le système envoie un email de vérification
        Alors un email avec un lien de connexion vers l'application devrait lui être envoyé
    `, async () => {
      // When
      const sendVerificationRequest = buildSendMagicLink({
        sendEmail,
        getUtilisateurFromEmail: fakeGetUtilisateurFromEmail,
        isActifAgentsPublics: false,
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
  });
});

describe(`Ne pas envoyer d'email avec un lien de connexion pour les utilisateurs qui doivent se connecter seulement avec ProConnect`, () => {
  const utilisateursNePouvantPasSeConnecterParEmail = [
    {
      email: dgec.identifiantUtilisateur.email,
      typeUtilisateur: 'un utilisateur DGEC',
    },
    {
      email: dgecValidateur.identifiantUtilisateur.email,
      typeUtilisateur: 'un validateur DGEC',
    },
    { email: dreal.identifiantUtilisateur.email, typeUtilisateur: 'une DREAL' },
    { email: cre.identifiantUtilisateur.email, typeUtilisateur: 'un utilisateur CRE' },
    { email: ademe.identifiantUtilisateur.email, typeUtilisateur: 'un utilisateur ADEME' },
  ];

  utilisateursNePouvantPasSeConnecterParEmail.forEach(({ email, typeUtilisateur }) => {
    test(`
            Étant donné ${typeUtilisateur}
            Lorsque le système envoie un email de vérification
            Alors un email expliquant qu'il faut se connecter avec ProConnect devrait être envoyé
            Mais aucun email avec un lien de connexion ne devrait être envoyé
        `, async () => {
      // When
      const sendVerificationRequest = buildSendMagicLink({
        sendEmail,
        getUtilisateurFromEmail: fakeGetUtilisateurFromEmail,
        isActifAgentsPublics: false,
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
  });

  test(`Étant donné que le lien magique est actif pour les agents publics
      Lorsque le système envoie un email de vérification
      Alors un email avec un lien de connexion vers l'application devrait lui être envoyé`, async () => {
    const email = dreal.identifiantUtilisateur.email;

    // When
    const sendVerificationRequest = buildSendMagicLink({
      sendEmail,
      getUtilisateurFromEmail: fakeGetUtilisateurFromEmail,
      isActifAgentsPublics: true,
    });
    await sendVerificationRequest({ email, url });

    // Then
    assert.strictEqual(sendEmail.mock.callCount(), 1, 'Un email devrait être envoyé');
  });
});

describe(`N'envoyer aucun email pour les utilisateurs désactivé`, () => {
  test(`
            Étant donné un utilisateur désactivé
            Lorsque le système envoie un email de vérification
            Alors aucun email ne devrait être envoyé
        `, async () => {
    // Given
    const email = porteurDeProjetDésactivé.identifiantUtilisateur.email;

    // When
    const sendVerificationRequest = buildSendMagicLink({
      sendEmail,
      getUtilisateurFromEmail: fakeGetUtilisateurFromEmail,
      isActifAgentsPublics: false,
    });
    await sendVerificationRequest({ email, url });

    // Then
    assert.strictEqual(sendEmail.mock.callCount(), 0, 'Aucun email ne devrait être envoyé');
  });
});
