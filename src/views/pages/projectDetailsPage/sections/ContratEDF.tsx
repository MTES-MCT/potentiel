import { BuildingIcon, Section } from '@components'
import React from 'react'
import { ProjectDataForProjectPage } from '@modules/project'

type ContratEDFProps = {
  contrat: Exclude<ProjectDataForProjectPage['contratEDF'], undefined>
}

export const ContratEDF = ({
  contrat: { numero, dateEffet, dateSignature, dateMiseEnService, type, duree, statut },
}: ContratEDFProps) => (
  <Section title="Contrat EDF" icon={BuildingIcon}>
    <Item title="Statut" value={statut} />
    <Item title="Numero de contrat" value={numero} />
    <Item title="Type" value={type} />
    <Item title="Date d'effet" value={dateEffet} />
    <Item title="Date de signature" value={dateSignature} />
    <Item title="Date de mise en service" value={dateMiseEnService} />
    <Item title="duree" value={`${duree?.toLocaleString()} jours`} />
  </Section>
)

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
