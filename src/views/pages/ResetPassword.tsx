import { Request } from 'express'
import React from 'react'
import routes from 'src/routes'
import { Button, Container, EmailInput, Footer, Header, SuccessErrorBox } from '../components'
import { RiLock2Line } from '@react-icons/all-files/ri/RiLock2Line'

type ResetPasswordProps = {
  request: Request
}

export const ResetPassword = (props: ResetPasswordProps) => {
  const { error, success } = (props.request.query as any) || {}

  return (
    <>
      <Header {...props}></Header>
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

            <div className="w-full md:p-8 lg:p-10 xl:p-14">
              <form
                action={routes.RESET_PASSWORD}
                method="POST"
                className="flex flex-col gap-3 p-4 mx-0 md:mx-auto bg-white"
              >
                <SuccessErrorBox success={success} error={error} />

                <label htmlFor="email">
                  Saisissez ici votre adresse email pour recevoir un lien de réinitialisation du mot
                  de passe par mail (le lien sera valable une heure) :
                </label>
                <EmailInput id="email" name="email" required />

                <Button className="mx-auto" type="submit" primary>
                  Envoyer
                </Button>
              </form>
            </div>
          </Container>
        </section>
      </main>
      <Footer></Footer>
    </>
  )
}
