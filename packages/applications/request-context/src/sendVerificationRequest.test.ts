import { describe, test } from 'node:test';
import assert from 'node:assert';

import { SendVerificationRequestParams } from 'next-auth/providers';

import { SendEmail } from '@potentiel-applications/notifications';
import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject, PlainType } from '@potentiel-domain/core';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { buildSendVerificationRequest } from './sendVerificationRequest';
import { GetUtilisateurFromEmail } from './getUtilisateur';

const porteurDeProjet: PlainType<
  Utilisateur.ValueType & {
    désactivé?: true;
  }
> = {
  role: { nom: 'porteur-projet' },
  nom: '',
  identifiantUtilisateur: Email.convertirEnValueType('porteur@test.test'),
  identifiantGestionnaireRéseau: Option.none,
  région: Option.none,
};

const adminDGEC: PlainType<
  Utilisateur.ValueType & {
    désactivé?: true;
  }
> = {
  role: { nom: 'admin' },
  nom: '',
  identifiantUtilisateur: Email.convertirEnValueType('dgec@test.test'),
  identifiantGestionnaireRéseau: Option.none,
  région: Option.none,
};

const fakeGetUtilisateurFromEmail: GetUtilisateurFromEmail = async (email) => {
  if (email === 'porteur@test.test') {
    return mapToPlainObject(porteurDeProjet);
  }

  if (email === 'dgec@test.test') {
    return mapToPlainObject(adminDGEC);
  }

  return Option.none;
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

describe(`Envoyer un email lors de la connexion par email`, () => {
  test(`
        Étant donné un porteur de projet
        Lorsque le système envoie un email de vérification
        Alors un email avec un lien de connexion vers l'application devrait luiêtre envoyé
    `, async () => {
    // Given
    let emailWasSent = false;
    const identifier = porteurDeProjet.identifiantUtilisateur.email;
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

  test(`
        Étant donné un administrateur DGEC
        Lorsque le système envoie un email de vérification
        Alors un email expliquant qu'il faut se connecter avec ProConnect devrait être envoyé
    `, async () => {
    // Given
    let emailWasSent = false;
    const identifier = adminDGEC.identifiantUtilisateur.email;
    const url = Routes.Auth.signIn();

    const fakeSendEmail: SendEmail = async (actual) => {
      const expected = {
        templateId: 999999,
        messageSubject: 'Potentiel - Connexion avec ProConnect obligatoire',
        recipients: [{ email: identifier, fullName: '' }],
        variables: {
          url,
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
