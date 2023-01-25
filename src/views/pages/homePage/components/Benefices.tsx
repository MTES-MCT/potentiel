import React from 'react'
import { Container } from '../../../components'

export const Benefices = () => (
  <section className="text-blue-france-sun-base mb-10">
    <h2
      className="text-3xl lg:text-4xl xl:text-5xl font-semibold pb-5 pt-10 px-4 text-center mb-0 md:mb-10"
      style={{ fontFamily: 'Marianne, arial, sans-serif' }}
    >
      Producteurs d'énergies renouvelables électriques
    </h2>
    <Container className="flex flex-col lg:flex-row">
      <img
        className="flex-2 hidden md:block self-center w-full p-4 lg:w-3/5 object-scale-down"
        src="/images/home/enr-illustration.png"
      />
      <div className="bg-blue-france-975-base lg:p-10 w-full lg:w-2/5">
        <ul className="flex flex-col text-lg xl:text-xl font-medium md:font-semibold w-fit md:mx-auto m-0 p-4">
          <Benefice title="Retrouvez vos projets" />
          <Benefice title="Suivez-les étape par étape" />
          <Benefice title="Gérez vos documents" />
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
  <li className="flex flex-row items-center leading-loose list-none">
    <img src="/images/home/check.png" className="align-bottom mr-2"></img>
    {title}
  </li>
)
