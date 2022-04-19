import { Request } from 'express'
import React from 'react'
import routes from 'src/routes'
import { Footer, Header, Button, Input, Container } from '../components'
import { RiSaveLine } from '@react-icons/all-files/ri/RiSaveLine'

type SignupProps = {
  request: Request
}

export const Signup = (props: SignupProps) => (
  <>
    <Header {...props} />

    <main style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
      <section className="bg-blue-france-sun-base">
        <Container className="flex flex-col md:flex-row">
          <h1
            className="flex items-center w-full md:w-1/2 lg:w-3/5 m-0 p-4 text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold"
            style={{ fontFamily: 'Marianne, arial, sans-serif' }}
          >
            Porteur de projet, inscrivez-vous sur Potentiel pour suivre vos projets, transmettre vos
            documents et déposer des demandes.
          </h1>

          <div className="w-full md:w-1/2 lg:w-2/5 md:p-8 lg:p-10 xl:p-14">
            <form
              action={routes.SIGNUP}
              method="POST"
              className="flex flex-col gap-3 p-4 mx-0 bg-white"
            >
              <div>
                <label htmlFor="firstname">Prénom</label>
                <Input type="text" id="firstname" name="firstname" required />
              </div>

              <div>
                <label htmlFor="lastname">Nom</label>
                <Input type="text" id="lastname" name="lastname" required />
              </div>

              <div>
                <label htmlFor="email">Adresse email</label>
                <Input type="email" id="email" name="email" required />
              </div>

              <Button className="inline-flex items-center mx-auto" type="submit" primary>
                <RiSaveLine className="mr-2" />
                M'inscrire
              </Button>
            </form>
          </div>
        </Container>
      </section>
    </main>

    <Footer />
  </>
)
