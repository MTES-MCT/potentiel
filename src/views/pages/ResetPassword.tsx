import { Request } from 'express'
import React from 'react'
import routes from 'src/routes'
import { Button, Container, Footer, Header, Input, LinkButton } from '../components'
import { RiLock2Line } from '@react-icons/all-files/ri/RiLock2Line'
import { RiErrorWarningFill } from '@react-icons/all-files/ri/RiErrorWarningFill'

type ResetPasswordProps = {
  request: Request
  validationErrors?: Array<{ [fieldName: string]: string }>
  error?: string
  success?: string
}

export const ResetPassword = ({ validationErrors, error, success }: ResetPasswordProps) => (
  <>
    <Header />
    <main>
      <section className="bg-blue-france-sun-base pb-0.5">
        <Container className="flex flex-col">
          <h1
            className="flex items-center w-full m-0 p-4 md:p-8 text-white text-2xl md:text-3xl lg:text-4xl font-semibold"
            style={{ fontFamily: 'Marianne, arial, sans-serif' }}
          >
            <div className="flex flex-col gap-5 md:text-center md:mx-auto">
              <RiLock2Line className="text-6xl hidden md:flex mx-auto" />
              Réinitialisation du mot de passe
            </div>
          </h1>

          {success ? <ResetSuccessful /> : <ResetForm {...{ validationErrors, error }} />}
        </Container>
      </section>
    </main>
    <Footer></Footer>
  </>
)

type ResetFormProps = {
  validationErrors?: Array<{ [fieldName: string]: string }>
  error?: string
}
const ResetForm = ({ validationErrors, error }: ResetFormProps) => (
  <div className="w-full md:p-8 lg:p-10 xl:p-14">
    <form
      action={routes.RESET_PASSWORD}
      method="POST"
      className="flex flex-col gap-3 p-4 mx-0 md:mx-auto bg-white"
    >
      {error && (
        <div className="flex flex-row border border-solid border-red-marianne-main-472-base">
          <div className="bg-red-marianne-main-472-base p-3">
            <RiErrorWarningFill className="text-white text-2xl" />
          </div>
          <p className="text-sm m-0 px-4 py-2">{error}</p>
        </div>
      )}

      <div className="text-sm italic">
        Après validation du formulaire, vous recevrez un lien pour réinitialiser votre mot de passe
        par courriel qui sera valable pendant une heure
      </div>

      <label htmlFor="email">Adresse courriel (obligatoire)</label>
      <Input
        type="email"
        id="email"
        name="email"
        required
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        {...(validationErrors && { error: validationErrors['email']?.toString() })}
      />

      <div className="flex flex-row gap-2 mx-auto mt-2">
        <Button type="submit" primary>
          Réinitialiser
        </Button>
        <LinkButton href={routes.HOME}>Annuler</LinkButton>
      </div>
    </form>
  </div>
)

const ResetSuccessful = () => (
  <>
    <div className="p-4 md:my-8 text-lg md:text-center text-white">
      Un courriel vous a été envoyé avec un lien valable pendant une heure pour réinitialiser votre
      mot de passe
    </div>

    <LinkButton className="my-4 mx-auto" href={routes.HOME}>
      Retour à l'accueil
    </LinkButton>
  </>
)
