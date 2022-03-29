import type { Request } from 'express'
import React from 'react'
import { PageLayout } from '../../components/PageLayout'
import { hydrateOnClient } from '../../helpers/hydrateOnClient'

type Props = {
  request: Request
}

export const Home = PageLayout(function (props: Props) {
  return (
    <>
      <main role="main">
        <section className="bg-blue-900 text-white">
          <div className="xl:mx-auto xl:max-w-7xl flex flex-col p-6 gap-6 xl:py-10">
            <div className="flex flex-col md:flex-row gap-6">
              <p className="m-0 text-3xl lg:text-5xl xl:text-6xl font-bold">
                Suivez efficacement vos projets EnRE*, transmettez vos documents, demandez des
                modifications.
                <br />
                <span className="text-sm lg:text-base font-light">
                  *Énergies renouvelables électriques
                </span>
              </p>
              <img className="w-full md:w-1/2" src="/images/home/proposition_valeur.png" />
            </div>
            <p className="text-lg md:text-base lg:text-xl font-medium md:font-semibold md:text-center md:m-0 md:mt-10 md:mb-0 lg:px-16 lg:leading-loose">
              Potentiel est le service du Ministère de la Transition Écologique qui connecte
              <br className="hidden md:inline" /> tous les acteurs du parcours administratif des
              projets d'EnRE soumis à appel d'offre en France
            </p>
          </div>
        </section>
        <section className="p-6">
          <a className="button button-primary" href="/login.html">
            Je m'identifie
          </a>
        </section>
      </main>
    </>
  )
})

hydrateOnClient(Home)
