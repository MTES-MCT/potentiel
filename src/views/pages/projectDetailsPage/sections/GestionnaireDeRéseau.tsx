import React from 'react'
import { Link, PlugIcon, Section } from '@components'
import { UserRole } from '@modules/users'
import routes from '@routes'
import { Project } from '@entities'

type GestionnaireDeRéseauProps = {
  projetId: Project['id']
  numeroGestionnaire: string
  role: UserRole
}

export const GestionnaireDeRéseau = ({
  numeroGestionnaire,
  role,
  projetId,
}: GestionnaireDeRéseauProps) => (
  <Section title="Gestionnaire de réseau" icon={PlugIcon}>
    <div className="mb-[10px]">Identifiant : {numeroGestionnaire}</div>
    {['admin', 'dgec-validateur', 'porteur-projet'].includes(role) && (
      <Link href={routes.GET_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU(projetId)}>Modifier</Link>
    )}
  </Section>
)
