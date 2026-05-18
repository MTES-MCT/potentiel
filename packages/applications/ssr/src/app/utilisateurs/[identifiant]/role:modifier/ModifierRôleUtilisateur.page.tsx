import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { PageTemplate } from '@/components/templates/Page.template';
import {
  ModifierRôleUtilisateurForm,
  type ModifierRôleUtilisateurFormProps,
} from './ModifierRôleUtilisateur.form';

export type ModifierRôleUtilisateurPageProps = ModifierRôleUtilisateurFormProps;

export const ModifierRôleUtilisateurPage: FC<ModifierRôleUtilisateurPageProps> = ({
  utilisateur,
  gestionnairesRéseau,
  régions,
  zones,
}) => (
  <PageTemplate
    banner={<Heading1>Modifier le rôle de {utilisateur.identifiantUtilisateur.email}</Heading1>}
  >
    <ColumnPageTemplate
      leftColumn={{
        children: (
          <ModifierRôleUtilisateurForm
            utilisateur={utilisateur}
            gestionnairesRéseau={gestionnairesRéseau}
            régions={régions}
            zones={zones}
          />
        ),
      }}
      rightColumn={{
        children: <></>,
      }}
    />
  </PageTemplate>
);
