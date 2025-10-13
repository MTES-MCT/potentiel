import { FC } from 'react';

import { DateTime, Email } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading2 } from '@/components/atoms/headings';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

import { DétailsChangementActionnairePageProps } from '../DétailsChangementActionnaire.page';

import { DemandeChangementActionnaire } from './DemandeChangement';
import { DemandeChangementActionnaireAccordée } from './DemandeChangementActionnaireAccordée';
import { DemandeChangementActionnaireRejetée } from './DemandeChangementActionnaireRejetée';

export type DétailsDemandeChangementActionnaireProps = Pick<
  DétailsChangementActionnairePageProps,
  'demande'
>;

export const DétailsDemandeChangementActionnaire: FC<DétailsDemandeChangementActionnaireProps> = ({
  demande,
}) => (
  <div className="flex flex-col gap-4">
    <div>
      <div className="flex flex-row gap-4">
        <Heading2>Demande de changement d'actionnaire(s)</Heading2>
        <StatutDemandeBadge statut={demande.statut.statut} />
      </div>
      <div className="text-xs italic">
        Demandé le{' '}
        <FormattedDate
          className="font-medium"
          date={DateTime.bind(demande.demandéeLe).formatter()}
        />{' '}
        par <span className="font-medium">{Email.bind(demande.demandéePar).formatter()}</span>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      {demande.accord && (
        <DemandeChangementActionnaireAccordée
          accordéeLe={demande.accord.accordéeLe}
          accordéePar={demande.accord.accordéePar}
          réponseSignée={demande.accord.réponseSignée}
        />
      )}
      {demande.rejet && (
        <DemandeChangementActionnaireRejetée
          rejetéeLe={demande.rejet.rejetéeLe}
          rejetéePar={demande.rejet.rejetéePar}
          réponseSignée={demande.rejet.réponseSignée}
        />
      )}
      <DemandeChangementActionnaire demande={demande} />
    </div>
  </div>
);
