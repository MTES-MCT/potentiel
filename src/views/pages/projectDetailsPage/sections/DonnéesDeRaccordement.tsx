import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { Section } from '../components'

type DonnéesDeRaccordementProps = {
  numeroGestionnaire?: string
  dateMiseEnService?: Date
  dateFileAttente?: Date
}

export const DonnéesDeRaccordement = ({
  numeroGestionnaire,
  dateFileAttente,
  dateMiseEnService,
}: DonnéesDeRaccordementProps) => (
  <Section title="Données de raccordement" icon="clipboard-check">
    {numeroGestionnaire && (
      <div className="mb-[10px]">Idenfiant de gestionnaire réseau: {numeroGestionnaire}</div>
    )}
    {dateFileAttente && (
      <div className="mb-[10px]">
        Date de mise en file d'attente: {formatDate(new Date(dateFileAttente))}
      </div>
    )}
    {dateMiseEnService && (
      <div className="mb-[10px]">
        Date de mise en service: {formatDate(new Date(dateMiseEnService))}
      </div>
    )}
  </Section>
)
