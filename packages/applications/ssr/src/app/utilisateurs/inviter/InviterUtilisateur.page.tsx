import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { PageTemplate } from '@/components/templates/Page.template';
import {
  InviterUtilisateurForm,
  type InviterUtilisateurFormProps,
} from './InviterUtilisateur.form';

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
          <Notice
            severity="info"
            title=""
            description="L'invitation d'un porteur de projet se fait depuis la page du projet."
          />
        ),
      }}
    />
  </PageTemplate>
);
