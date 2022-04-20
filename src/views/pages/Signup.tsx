import { Request } from 'express'
import React from 'react'
import routes from 'src/routes'
import { Footer, Header, Button, Input, Container, LinkButton } from '../components'
import { RiSaveLine } from '@react-icons/all-files/ri/RiSaveLine'

type SignupProps = {
  user: Request['user']
  validationErrors?: Array<{ [fieldName: string]: string }>
}

export const Signup = ({ user, validationErrors }: SignupProps) => {
  return (
    <>
      <Header {...{ user }} />

      <main style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
        <section className="bg-blue-france-sun-base pb-0.5">
          <Container className="flex flex-col md:flex-row">
            <h1
              className="flex items-center w-full md:w-1/2 lg:w-3/5 m-0 p-4 text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold"
              style={{ fontFamily: 'Marianne, arial, sans-serif' }}
            >
              Porteur de projet, inscrivez-vous sur Potentiel pour suivre vos projets, transmettre
              vos documents et déposer des demandes.
            </h1>

            <div className="w-full md:w-1/2 lg:w-2/5 md:p-8 lg:p-10 xl:p-14">
              <form
                action={routes.SIGNUP}
                method="POST"
                className="flex flex-col gap-3 p-4 mx-0 bg-white"
              >
                <div className="text-sm italic">Tous les champs sont obligatoires</div>

                <div>
                  <label htmlFor="firstname">Prénom</label>
                  <Input
                    type="text"
                    id="firstname"
                    name="firstname"
                    required
                    {...(validationErrors && { error: validationErrors['firstname']?.toString() })}
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
                    {...(validationErrors && { error: validationErrors['email']?.toString() })}
                  />
                </div>

                <div className="flex flex-row gap-2 mx-auto mt-2">
                  <Button className="inline-flex items-center" type="submit" primary>
                    <RiSaveLine className="mr-2" />
                    M'inscrire
                  </Button>
                  <LinkButton href={routes.HOME}>Annuler</LinkButton>
                </div>
              </form>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  )
}
