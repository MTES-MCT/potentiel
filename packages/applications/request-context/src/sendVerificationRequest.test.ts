import { describe, test } from 'node:test';
import assert from 'node:assert';

import { SendEmail } from '@potentiel-applications/notifications';

import { buildSendVerificationRequest } from './sendVerificationRequest';

describe(`Envoyer un email lors de la connexion par email`, () => {
  test(`
        Étant donné un porteur de projet
        Lorsque le système envoie un email de vérification
        Alors un email avec un lien de connexion vers l'application devrait luiêtre envoyé
    `, async () => {
    // Given
    let emailWasSent = false;
    const identifier = 'porteur@test.test';
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
    const sendVerificationRequest = buildSendVerificationRequest(fakeSendEmail);
    await sendVerificationRequest({
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
        sendVerificationRequest,
        options: {},
      },
      token: '',
      theme: {},
    });

    // Then
    assert.strictEqual(emailWasSent, true);
  });
});
