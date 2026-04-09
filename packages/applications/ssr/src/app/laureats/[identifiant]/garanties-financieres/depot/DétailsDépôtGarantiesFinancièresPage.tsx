import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { GarantiesFinancières } from '../components/GarantiesFinancières';

import {
  DépôtGarantiesFinancièresActions,
  DépôtGarantiesFinancièresActionsProps,
} from './DépôtGarantiesFinancièresActions';

export type DétailsDépôtGarantiesFinancièresPageProps = DépôtGarantiesFinancièresActionsProps & {
  dépôt: PlainType<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel>;
};

export const DétailsDépôtGarantiesFinancièresPage: FC<
  DétailsDépôtGarantiesFinancièresPageProps
> = ({ identifiantProjet, dépôt, actions }) => {
  const gf = Lauréat.GarantiesFinancières.GarantiesFinancières.bind(dépôt.garantiesFinancières);

  return (
    <ColumnPageTemplate
      heading={<Heading2>Détail du dépôt de garanties financières</Heading2>}
      leftColumn={{
        children: (
          <>
            {gf.estÉchu() && (
              <Alert
                severity="info"
                small
                className="mb-2"
                description={
                  <p>
                    La date d'échéance de ces garanties financières étant passée, elles seront
                    automatiquement échues à leur validation.
                  </p>
                }
              />
            )}
            <GarantiesFinancières
              garantiesFinancières={dépôt.garantiesFinancières}
              document={dépôt.document}
              soumisLe={dépôt.soumisLe}
              peutModifier
            />
          </>
        ),
      }}
      rightColumn={{
        children: (
          <DépôtGarantiesFinancièresActions
            identifiantProjet={identifiantProjet}
            actions={actions}
          />
        ),
      }}
    />
  );
};
