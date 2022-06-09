import React from 'react'
import { Container } from '../../../components'

export const PropositionDeValeur = () => (
  <section className="bg-blue-france-sun-base text-white">
    <Container className="flex flex-col p-6 gap-6 xl:pt-10">
      <div className="flex flex-col md:flex-row">
        <h1
          className="m-0 text-3xl lg:text-4xl xl:text-5xl font-semibold lg:pt-10 md:w-1/2"
          style={{ fontFamily: 'Marianne, arial, sans-serif' }}
        >
          Suivez efficacement vos projets d'EnR* électriques, transmettez vos documents, demandez
          des modifications.
          <br />
          <span className="text-sm lg:text-base font-light">*Énergies renouvelables</span>
        </h1>
        <img
          className="flex object-scale-down w-full md:w-1/2"
          src="/images/home/proposition_valeur.png"
        />
      </div>
      <p className="text-lg md:text-base lg:text-xl font-medium md:font-semibold md:text-center md:m-0 md:mt-10 md:mb-0 lg:px-16 lg:leading-loose">
        Potentiel est le service du Ministère de la Transition Écologique qui connecte
        <br className="hidden md:inline" /> les acteurs du parcours administratif des projets d'EnR
        électriques soumis à appel d'offres en France.
      </p>
    </Container>
  </section>
)
