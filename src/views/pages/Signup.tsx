import { Request } from 'express';
import React from 'react';
import routes from '@routes';
import {
  Footer,
  Header,
  PrimaryButton,
  Input,
  Container,
  LinkButton,
  SecondaryLinkButton,
} from '@components';
import { RiSaveLine } from '@react-icons/all-files/ri/RiSaveLine';
import { RiErrorWarningFill } from '@react-icons/all-files/ri/RiErrorWarningFill';
import { hydrateOnClient } from '../helpers';

type SignupProps = {
  request: Request;
  validationErrors?: Array<{ [fieldName: string]: string }>;
  error?: string;
  success?: string;
} & ({ utilisateurInvité: true; email: string } | { utilisateurInvité: false });

export const Signup = (props: SignupProps) => (
  <>
    <Header />

    <main style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
      <section className="bg-blue-france-sun-base pb-0.5">
        {props.success ? (
          <SignupSuccessful />
        ) : props.error ? (
          <SignupFailed error={props.error} />
        ) : (
          <SignupForm {...props} />
        )}
      </section>
    </main>

    <Footer />
  </>
);

type SignupFormProps = {
  utilisateurInvité: boolean;
  email?: string;
  validationErrors?: Array<{ [fieldName: string]: string }>;
  error?: string;
};
const SignupForm = ({ utilisateurInvité, email, validationErrors, error }: SignupFormProps) => (
  <Container className="flex flex-col md:flex-row">
    <h1
      className="flex items-center w-full md:w-1/2 lg:w-3/5 m-0 p-4 text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold"
      style={{ fontFamily: 'Marianne, arial, sans-serif' }}
    >
      {utilisateurInvité
        ? `Inscrivez-vous sur Potentiel pour suivre des projets d'EnR électriques soumis à appel d'offres en France.`
        : `Porteur de projet, inscrivez-vous sur Potentiel pour suivre vos projets, transmettre vos
      documents et déposer des demandes.`}
    </h1>

    <div className="w-full md:w-1/2 lg:w-2/5 md:p-8 lg:p-10 xl:p-14">
      <form
        action={routes.POST_SIGNUP}
        method="POST"
        className="flex flex-col gap-3 p-4 mx-0 bg-white"
      >
        {error && (
          <div className="flex flex-row border border-solid border-red-marianne-main-472-base">
            <div className="bg-red-marianne-main-472-base p-3">
              <RiErrorWarningFill className="text-white text-2xl" />
            </div>
            <p className="text-sm m-0 px-4 py-2">{error}</p>
          </div>
        )}

        <div className="text-sm italic">Tous les champs sont obligatoires</div>

        <div>
          <label htmlFor="firstname">Prénom</label>
          <Input
            type="text"
            id="firstname"
            name="firstname"
            required
            {...(validationErrors && {
              error: validationErrors['firstname']?.toString(),
            })}
          />
        </div>

        <div>
          <label htmlFor="lastname">Nom</label>
          <Input
            type="text"
            id="lastname"
            name="lastname"
            required
            {...(validationErrors && { error: validationErrors['lastname']?.toString() })}
          />
        </div>

        <div>
          <label htmlFor="email">Adresse courriel</label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            {...(email && { value: email, readOnly: true })}
            {...(validationErrors && { error: validationErrors['email']?.toString() })}
          />
        </div>

        <input
          type="hidden"
          required
          name="utilisateurInvité"
          value={utilisateurInvité ? 'true' : 'false'}
        />

        <div className="flex flex-row gap-2 mx-auto mt-2">
          <PrimaryButton className="inline-flex items-center" type="submit">
            <RiSaveLine className="mr-2" />
            M'inscrire
          </PrimaryButton>
          <SecondaryLinkButton href={routes.HOME}>Annuler</SecondaryLinkButton>
        </div>
      </form>
    </div>
  </Container>
);

const SignupSuccessful = () => (
  <Container className="flex flex-col p-4 md:p-10 text-white">
    <h1
      className="flex items-center text-center w-full m-0 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold"
      style={{ fontFamily: 'Marianne, arial, sans-serif' }}
    >
      <div className="flex flex-col gap-5 md:text-center md:mx-auto">
        <div>🎉</div>
        Votre compte a été créé avec succès
      </div>
    </h1>

    <div className="my-8 text-lg text-center">
      Un courriel vous a été envoyé afin de vérifier et valider votre inscription.
    </div>

    <SecondaryLinkButton className="my-4 mx-auto" href={routes.HOME}>
      Retour à l'accueil
    </SecondaryLinkButton>
  </Container>
);

type SignupFailedProps = {
  error: string;
};
const SignupFailed = ({ error }: SignupFailedProps) => (
  <Container className="flex flex-col p-4 md:p-10 text-white">
    <h1
      className="flex items-center text-center w-full m-0 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold"
      style={{ fontFamily: 'Marianne, arial, sans-serif' }}
    >
      <span className="flex flex-col gap-5 md:text-center md:mx-auto">
        Le compte utilisateur n'a pas pu être créé.
      </span>
    </h1>

    <div className="my-8 text-lg text-center">{error}</div>

    <div className="flex gap-5 mt-10 flex-col mx-auto">
      <LinkButton className="text-center" href={routes.LOGIN}>
        M'identifier
      </LinkButton>
      <LinkButton className="text-center" href={routes.SIGNUP}>
        M'inscrire
      </LinkButton>
    </div>
  </Container>
);

hydrateOnClient(Signup);
