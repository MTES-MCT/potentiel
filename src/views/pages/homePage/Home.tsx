import type { Request } from 'express'
import React from 'react'
import { RiAccountCircleLine } from 'react-icons/ri'
import { PageLayout } from '../../components/PageLayout'
import { hydrateOnClient } from '../../helpers/hydrateOnClient'

type Props = {
  request: Request
}

export const Home = PageLayout(function (props: Props) {
  return (
    <>
      <main role="main" style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
        <section className="bg-blue-france-sun-base text-white">
          <div className="xl:mx-auto xl:max-w-7xl flex flex-col p-6 gap-6 xl:py-10">
            <div className="flex flex-col md:flex-row gap-6">
              <p className="m-0 text-3xl lg:text-5xl xl:text-6xl font-semibold">
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
        <section className="xl:mx-auto xl:max-w-7xl flex p-6">
          <a
            className="mx-auto no-underline inline-flex items-center px-6 py-3 border border-transparent text-base lg:text-lg font-medium shadow-sm text-white bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-blue-france-sun-active"
            style={{ color: 'white', textDecoration: 'none' }}
            href="/login.html"
          >
            <RiAccountCircleLine className="mr-4" />
            Je m'identifie
          </a>
        </section>
      </main>
    </>
  )
})

hydrateOnClient(Home)
