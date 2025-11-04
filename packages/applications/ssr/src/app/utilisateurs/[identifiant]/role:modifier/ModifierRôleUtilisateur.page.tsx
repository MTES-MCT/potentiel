import { FC } from 'react';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import {
  ModifierRôleUtilisateurForm,
  ModifierRôleUtilisateurFormProps,
} from './ModifierRôleUtilisateur.form';

export type ModifierRôleUtilisateurPageProps = ModifierRôleUtilisateurFormProps;

export const ModifierRôleUtilisateurPage: FC<ModifierRôleUtilisateurPageProps> = ({
  utilisateur,
  gestionnairesRéseau,
  régions,
  zones,
}) => (
  <ColumnPageTemplate
    banner={<></>}
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
);
