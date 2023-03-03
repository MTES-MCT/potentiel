import React from 'react';
import { Link, PlugIcon, Section } from '@components';
import { UserRole } from '@modules/users';
import routes from '@routes';
import { Project } from '@entities';

type GestionnaireDeRéseauProps = {
  projetId: Project['id'];
  gestionnaireRéseau?: {
    identifiantGestionnaire: string;
    codeEICGestionnaireRéseau?: string;
    raisonSocialeGestionnaireRéseau?: string;
  };
  role: UserRole;
};

export const GestionnaireDeRéseau = ({
  gestionnaireRéseau,
  role,
  projetId,
}: GestionnaireDeRéseauProps) => (
  <Section title="Gestionnaire de réseau" icon={PlugIcon}>
    {gestionnaireRéseau ? (
      <div>
        <ul>
          <li>
            Gestionnaire de réseau :{' '}
            {gestionnaireRéseau.raisonSocialeGestionnaireRéseau || (
              <span className="italic">Non renseigné</span>
            )}
          </li>
          <li>
            Code EIC gestionnaire de réseau :{' '}
            {gestionnaireRéseau.codeEICGestionnaireRéseau || (
              <span className="italic">Non renseigné</span>
            )}
          </li>
          <li>Identifiant du projet : {gestionnaireRéseau.identifiantGestionnaire}</li>
        </ul>
      </div>
    ) : (
      <div>Aucun identifiant n'est rattaché au projet</div>
    )}
    {['admin', 'dgec-validateur', 'porteur-projet'].includes(role) && (
      <Link href={routes.GET_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU(projetId)}>
        {gestionnaireRéseau ? 'Modifier' : 'Ajouter'}
      </Link>
    )}
  </Section>
);
