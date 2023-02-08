import React from 'react'
import { Section } from '../components'

type GestionnaireDeRéseauProps = {
  numeroGestionnaire: string
}

export const GestionnaireDeRéseau = ({ numeroGestionnaire }: GestionnaireDeRéseauProps) => (
  <Section title="Gestionnaire de réseau" icon="plug">
    <div className="mb-[10px]">Identifiant : {numeroGestionnaire}</div>
  </Section>
)
