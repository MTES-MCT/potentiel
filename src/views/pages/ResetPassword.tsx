import { Request } from 'express'
import React from 'react'
import routes from 'src/routes'
import { Footer, Header } from '../components'
import { Input } from '../components/timeline/components/Input'

type ResetPasswordProps = {
  request: Request
  error?: string
  success?: string
}

export const ResetPassword = (props: ResetPasswordProps) => {
  const { error, success } = props
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
          {error && <div className="notification warning mt-4">{error}</div>}
          {success && <div className="notification success mt-4">{success}</div>}
          <Input
            type="email"
            name="email"
            label="Saisissez ici votre adresse email pour recevoir un lien de réinitialisation du mot de passe par
            mail :"
            required
          />
          <button type="submit">Envoyer</button>
        </form>
      </main>
      <Footer></Footer>
    </>
  )
}
