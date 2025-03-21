import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { ColumnTemplate } from '@/components/templates/Column.template';
import { PageTemplate } from '@/components/templates/Page.template';

import { InviterUtilisateurForm, InviterUtilisateurFormProps } from './InviterUtilisateur.form';

export type InviterUtilisateurPageProps = InviterUtilisateurFormProps;

export const InviterUtilisateurPage: FC<InviterUtilisateurPageProps> = ({
  role,
  gestionnairesRéseau,
  régions,
}) => (
  <PageTemplate>
    <ColumnTemplate
      leftColumn={{
        children: (
          <InviterUtilisateurForm
            role={role}
            gestionnairesRéseau={gestionnairesRéseau}
            régions={régions}
          />
        ),
      }}
      rightColumn={{
        children: (
          <Alert
            small
            severity="info"
            description="L'invitation d'un porteur de projet se fait depuis la page du projet."
          />
        ),
      }}
    />
  </PageTemplate>
);
