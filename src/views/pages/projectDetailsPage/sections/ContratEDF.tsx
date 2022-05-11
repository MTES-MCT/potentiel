import React from 'react'
import { ProjectDataForProjectPage } from '../../../../modules/project'
import { Section } from '../components'

type ContratEDFProps = {
  contrat: Exclude<ProjectDataForProjectPage['contratEDF'], undefined>
}

export const ContratEDF = ({ contrat }: ContratEDFProps) => {
  const { numero, dateEffet, dateSignature, type, duree } = contrat

  return (
    <Section title="Contrat EDF" icon="building">
      <Item title="Numero de contrat" value={numero} />
      <Item title="Type" value={type} />
      <Item title="Date d'effet" value={dateEffet} />
      <Item title="Date de signature" value={dateSignature} />
      <Item title="duree" value={`${duree?.toLocaleString()} jours`} />
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
