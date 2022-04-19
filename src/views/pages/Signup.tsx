import { Request } from 'express'
import React from 'react'
import routes from 'src/routes'
import { Footer, Header, SuccessErrorBox } from '../components'
import { Input } from '../components/timeline/components/Input'

type SignupProps = {
  request: Request
}

export const Signup = (props: SignupProps) => {
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
            Porteur de projet, inscrivez-vous sur Potentiel pour suivre vos projets, transmettre vos
            documents et déposer des demandes.
          </h1>
        </div>
        <form action={routes.SIGNUP} method="POST" className="flex flex-col gap-3 bg-white p-10">
          <SuccessErrorBox success={success} error={error} />
          <Input type="text" name="firstname" label="Prénom" required />
          <Input type="text" name="lastname" label="Nom" required />
          <Input type="email" name="email" label="Adresse email" required />
          <button type="submit">M'inscrire</button>
        </form>
      </main>
      <Footer></Footer>
    </>
  )
}
