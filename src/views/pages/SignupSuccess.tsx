import React from 'react'
import routes from 'src/routes'
import { Footer, Header, Container, LinkButton } from '../components'

export const SignupSuccess = ({ request }) => {
  return (
    <>
      <Header />

      <main style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
        <section className="bg-blue-france-sun-base pb-0.5">
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

            <div className="my-8 italic text-lg text-center">
              Un courriel vous a été envoyé afin de vérifier et valider votre inscription.
            </div>

            <LinkButton className="my-4 mx-auto" href={routes.HOME}>
              Retour à l'accueil
            </LinkButton>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  )
}
