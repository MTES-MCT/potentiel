import React from 'react'
import { ProjectDataForProjectPage } from '../../../../modules/project'
import { Section } from '../components'

type ContratEnedisProps = {
  contrat: Exclude<ProjectDataForProjectPage['contratEnedis'], undefined>
}

export const ContratEnedis = ({ contrat }: ContratEnedisProps) => {
  const { numero } = contrat

  return (
    <Section title="Contrat Enedis" icon="building">
      <Item title="Numero de contrat" value={numero} />
    </Section>
  )
}

type ItemProps = {
  title: string
  value: string | undefined
}
const Item = ({ title, value }: ItemProps) => {
  if (!value) return null

  return (
    <div>
      <h5 className="m-0">{title}</h5>
      <div className="pt-1 pb-2">{value}</div>
    </div>
  )
}
