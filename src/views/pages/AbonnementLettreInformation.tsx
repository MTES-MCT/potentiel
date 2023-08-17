import { Request } from 'express';
import React from 'react';
import routes from '../../routes';
import {
  Footer,
  Header,
  PrimaryButton,
  Input,
  Container,
  SecondaryLinkButton,
  Form,
  ErrorIcon,
  SaveIcon,
  ToutLesChampsObligatoiresLégende,
} from '../components';
import { hydrateOnClient } from '../helpers';

type AbonnementLettreInformationProps = {
  request: Request;
  validationErrors?: Array<{ [fieldName: string]: string }>;
  error?: string;
  success?: string;
};

export const AbonnementLettreInformation = ({
  request: { user },
  validationErrors,
  error,
  success,
}: AbonnementLettreInformationProps) => (
  <>
    <Header {...{ user }} />

    <main id="contenu" style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
      <section className="bg-blue-france-sun-base pb-0.5">
        {success ? (
          <AbonnementLettreInformationSuccessful />
        ) : (
          <AbonnementLettreInformationForm {...{ user, error, validationErrors }} />
        )}
      </section>
    </main>

    <Footer user={user} />
  </>
);

type AbonnementLettreInformationFormProps = {
  user?: Request['user'];
  validationErrors?: Array<{ [fieldName: string]: string }>;
  error?: string;
};
const AbonnementLettreInformationForm = ({
  user,
  validationErrors,
  error,
}: AbonnementLettreInformationFormProps) => (
  <Container className="flex flex-col md:flex-row">
    <h1
      className="flex items-center w-full md:w-1/2 lg:w-3/5 m-0 p-4 text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold"
      style={{ fontFamily: 'Marianne, arial, sans-serif' }}
    >
      Abonnez-vous à la lettre d'information Potentiel.
    </h1>

    <div className="w-full md:w-1/2 lg:w-2/5 md:p-8 lg:p-10 xl:p-14">
      <Form
        action={routes.POST_SINSCRIRE_LETTRE_INFORMATION}
        method="POST"
        className="flex flex-col gap-3 p-4 mx-0 bg-white"
      >
        {error && (
          <div className="flex flex-row border border-solid border-red-marianne-main-472-base">
            <div className="bg-red-marianne-main-472-base p-3">
              <ErrorIcon className="text-white text-2xl" />
            </div>
            <p className="text-sm m-0 px-4 py-2">{error}</p>
          </div>
        )}

        <ToutLesChampsObligatoiresLégende />

        <div>
          <label htmlFor="email">Adresse courriel</label>
          <Input
            type="email"
            id="email"
            name="email"
            value={user?.email}
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            {...(validationErrors && { error: validationErrors['email']?.toString() })}
          />
        </div>

        <div>
          En m'abonnant, j'accepte de recevoir cette lettre d'information et je comprends que je
          peux me désabonner facilement à tout moment.
        </div>

        <div className="flex flex-row gap-2 mx-auto mt-2">
          <PrimaryButton className="inline-flex items-center" type="submit">
            <SaveIcon className="mr-2" />
            M'abonner
          </PrimaryButton>
          <SecondaryLinkButton href={routes.HOME}>Annuler</SecondaryLinkButton>
        </div>
      </Form>
    </div>
  </Container>
);

const AbonnementLettreInformationSuccessful = () => (
  <Container className="flex flex-col p-4 md:p-10 text-white">
    <h1
      className="flex items-center text-center w-full m-0 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold"
      style={{ fontFamily: 'Marianne, arial, sans-serif' }}
    >
      <div className="flex flex-col gap-5 md:text-center md:mx-auto">
        <div>🎉</div>
        Vous êtes bien inscrit à la lettre d'information Potentiel.
        <div className="my-3">À bientôt !</div>
      </div>
    </h1>

    <SecondaryLinkButton className="mt-8 my-4 mx-auto" href={routes.HOME}>
      Retour à l'accueil
    </SecondaryLinkButton>
  </Container>
);

hydrateOnClient(AbonnementLettreInformation);
