import { Request } from 'express'
import React from 'react'
import routes from 'src/routes'
import { Button, EmailInput, Footer, Header, SuccessErrorBox } from '../components'

type ResetPasswordProps = {
  request: Request
}

export const ResetPassword = (props: ResetPasswordProps) => {
  const { error, success } = (props.request.query as any) || {}

  return (
    <>
      <Header {...props}></Header>
      <main>
        <div className="bg-blue-france-sun-base">
          <h1
            className="text-xl lg:text-2xl xl:text-3xl font-semibold lg:py-10 text-white"
            style={{ fontFamily: 'Marianne, arial, sans-serif', maxWidth: 1280, margin: 'auto' }}
          >
            Réinitialisation du mot de passe
          </h1>
        </div>
        <form
          action={routes.RESET_PASSWORD}
          method="POST"
          className="flex flex-col gap-3 bg-white p-10"
        >
          <SuccessErrorBox success={success} error={error} />

          <label htmlFor="email">
            Saisissez ici votre adresse email pour recevoir un lien de réinitialisation du mot de
            passe par mail (le lien sera valable une heure) :
          </label>
          <EmailInput id="email" name="email" required />

          <Button type="submit">Envoyer</Button>
        </form>
      </main>
      <Footer></Footer>
    </>
  )
}
