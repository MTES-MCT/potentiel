import React from 'react';
import { Link, PlugIcon, Section } from '@components';
import { UserRole } from '@modules/users';
import routes from '@routes';
import { Project } from '@entities';

type GestionnaireDeRéseauProps = {
  projetId: Project['id'];
  identifiantGestionnaire?: string;
  role: UserRole;
};

export const GestionnaireDeRéseau = ({
  identifiantGestionnaire,
  role,
  projetId,
}: GestionnaireDeRéseauProps) => (
  <Section title="Gestionnaire de réseau" icon={PlugIcon}>
    <div className="mb-[10px]">
      {identifiantGestionnaire
        ? `Identifiant : ${identifiantGestionnaire}`
        : `Aucun identifiant n'est rattaché au projet`}
    </div>
    {['admin', 'dgec-validateur', 'porteur-projet'].includes(role) && (
      <Link href={routes.GET_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU(projetId)}>
        {identifiantGestionnaire ? 'Modifier' : 'Ajouter'}
      </Link>
    )}
  </Section>
);
