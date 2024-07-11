import { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';
import { GarantiesFinancières } from '../../../organisms/garantiesFinancières/GarantiesFinancières';
import {
  DépôtGarantiesFinancières,
  GarantiesFinancièresActuelles,
} from '../../../organisms/garantiesFinancières/types';

import { InfoBoxMainlevée } from './components/InfoBoxMainlevée';
import { InfoBoxSoumettreGarantiesFinancières } from './components/InfoBoxSoummettreGarantiesFinancières';
import { GarantiesFinancièresManquantes } from './components/GarantiesFinancièresManquantes';
import { HistoriqueMainlevéeRejetéeProps } from './components/HistoriqueMainlevéeRejetée';
import { MainlevéeEnCoursProps } from './components/MainlevéeEnCours';

export type DétailsGarantiesFinancièresPageProps = {
  identifiantProjet: string;
  actuelles?: GarantiesFinancièresActuelles;
  dépôtEnCours?: DépôtGarantiesFinancières;
  dateLimiteSoummission?: Iso8601DateTime;
  mainlevée?: MainlevéeEnCoursProps['mainlevéeEnCours'];
  historiqueMainlevée?: HistoriqueMainlevéeRejetéeProps['historiqueMainlevée'];
  afficherInfoConditionsMainlevée: boolean;
  action?: 'soumettre' | 'enregistrer';
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresPageProps> = ({
  identifiantProjet,
  actuelles,
  dépôtEnCours,
  action,
  mainlevée,
  historiqueMainlevée,
  afficherInfoConditionsMainlevée,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <TitrePageGarantiesFinancières title="Détail des garanties financières" />
    <>
      <div className="flex flex-col lg:flex-row gap-4">
        {actuelles && (
          <GarantiesFinancières
            garantiesFinancières={actuelles}
            identifiantProjet={identifiantProjet}
            mainlevée={mainlevée}
            historiqueMainlevée={historiqueMainlevée}
          />
        )}
        {dépôtEnCours && (
          <GarantiesFinancières
            garantiesFinancières={dépôtEnCours}
            identifiantProjet={identifiantProjet}
            mainlevée={mainlevée}
            historiqueMainlevée={historiqueMainlevée}
          />
        )}
      </div>
      {afficherInfoConditionsMainlevée && <InfoBoxMainlevée />}
      {action === 'soumettre' && (
        <InfoBoxSoumettreGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
    </>
    <GarantiesFinancièresManquantes identifiantProjet={identifiantProjet} action={action} />
  </PageTemplate>
);
