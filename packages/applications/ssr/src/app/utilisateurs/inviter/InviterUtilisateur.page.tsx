import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';

import { InviterUtilisateurForm, InviterUtilisateurFormProps } from './InviterUtilisateur.form';

export type InviterUtilisateurPageProps = InviterUtilisateurFormProps;

export const InviterUtilisateurPage: FC<InviterUtilisateurPageProps> = ({
  rôle,
  gestionnairesRéseau,
  régions,
  zones,
}) => (
  <PageTemplate banner={<Heading1>Inviter un utilisateur</Heading1>}>
    <ColumnPageTemplate
      leftColumn={{
        children: (
          <InviterUtilisateurForm
            rôle={rôle}
            gestionnairesRéseau={gestionnairesRéseau}
            régions={régions}
            zones={zones}
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
