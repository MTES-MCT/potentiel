import React from 'react'
import { Container } from '../../../components'

export const Benefices = () => (
  <section className="text-blue-france-sun-base mb-10">
    <h1
      className="text-3xl lg:text-4xl xl:text-5xl font-semibold pb-5 pt-10 text-center mb-0 md:mb-10"
      style={{ fontFamily: 'Marianne, arial, sans-serif' }}
    >
      Producteurs d'énergies renouvelables électriques
    </h1>
    <Container className="flex flex-row">
      <div className="flex-2 hidden md:block md:self-center">
        <img className="object-scale-down w-full" src="/images/home/enr-illustration.png" />
      </div>
      <div className="bg-blue-france-975-base py-5 lg:p-10 m-auto">
        <ul className="text-lg md:text-base lg:text-xl font-medium md:font-semibold px-5 py-0">
          <Benefice title="Retrouvez vos projets" />
          <Benefice title="Suivez-les étape par étape" />
          <Benefice title="Gérer vos documents" />
          <Benefice title="Signalez des changements" />
          <Benefice title="Demandez des modifications" />
          <Benefice title="Invitez vos collègues" />
        </ul>
      </div>
    </Container>
  </section>
)

type BeneficeProps = {
  title: string
}
const Benefice = ({ title }: BeneficeProps) => (
  <li className="leading-loose whitespace-nowrap list-none">
    <img src="/images/home/check.png" className="align-bottom mr-2"></img>
    {title}
  </li>
)
