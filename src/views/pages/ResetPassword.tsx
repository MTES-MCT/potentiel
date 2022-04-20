import { Request } from 'express'
import React from 'react'
import routes from 'src/routes'
import { Button, Container, Footer, Header, Input } from '../components'
import { RiLock2Line } from '@react-icons/all-files/ri/RiLock2Line'

type ResetPasswordProps = {
  user: Request['user']
  validationErrors?: Array<{ [fieldName: string]: string }>
}

export const ResetPassword = ({ validationErrors, user }: ResetPasswordProps) => (
  <>
    <Header {...{ user }}></Header>
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
              <label htmlFor="email">
                Saisissez ici votre adresse email pour recevoir un lien de réinitialisation du mot
                de passe par mail (le lien sera valable une heure) :
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                {...(validationErrors && { error: validationErrors['email']?.toString() })}
              />

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
