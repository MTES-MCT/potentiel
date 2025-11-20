import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { Heading1 } from '@/components/atoms/headings';

import { DemanderChangementActionnaireForm } from './DemanderChangementActionnaire.form';
import { InfoBoxDemandeActionnaire } from './InfoxBoxDemandeActionnaire';

export type DemanderChangementActionnairePageProps =
  PlainType<Lauréat.Actionnaire.ConsulterActionnaireReadModel>;

export const DemanderChangementActionnairePage: FC<DemanderChangementActionnairePageProps> = ({
  identifiantProjet,
  actionnaire,
}) => (
  <>
    <Heading1>Demander un changement d’actionnaire(s)</Heading1>
    <InfoBoxDemandeActionnaire />
    <DemanderChangementActionnaireForm
      identifiantProjet={identifiantProjet}
      actionnaire={actionnaire}
    />
  </>
);
