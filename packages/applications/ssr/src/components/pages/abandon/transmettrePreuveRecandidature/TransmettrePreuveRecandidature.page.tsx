import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';

import {
  TransmettrePreuveRecandidatureForm,
  TransmettrePreuveRecandidatureFormProps,
} from './TransmettrePreuveRecandidature.form';

export type TransmettrePreuveRecandidaturePageProps = TransmettrePreuveRecandidatureFormProps;

export const TransmettrePreuveRecandidaturePage: FC<TransmettrePreuveRecandidaturePageProps> = ({
  identifiantProjet,
  projetsÀSélectionner,
}) => {
  return (
    <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
      <Heading1>Transmettre preuve de recandidature</Heading1>
      {projetsÀSélectionner.length > 0 ? (
        <TransmettrePreuveRecandidatureForm
          identifiantProjet={identifiantProjet}
          projetsÀSélectionner={projetsÀSélectionner}
        />
      ) : (
        <p>Vous ne disposez d'aucun projet éligible avec une preuve de recandidature</p>
      )}
    </PageTemplate>
  );
};
