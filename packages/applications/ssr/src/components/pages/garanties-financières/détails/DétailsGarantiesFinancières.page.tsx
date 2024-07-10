import { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';
import { GarantiesFinancières } from '../../../organisms/garantiesFinancières/GarantiesFinancières';

import { GarantiesFinancièresActuellesProps } from './components/GarantiesFinancièresActuelles';
import { GarantiesFinancièresDépôtEnCoursProps } from './components/GarantiesFinancièresDépôtEnCours';
import { InfoBoxMainlevée } from './components/InfoBoxMainlevée';
import { InfoBoxSoumettreGarantiesFinancières } from './components/InfoBoxSoummettreGarantiesFinancières';
import { GarantiesFinancièresManquantes } from './components/GarantiesFinancièresManquantes';

export type DétailsGarantiesFinancièresPageProps = {
  identifiantProjet: string;
  actuelles?: GarantiesFinancièresActuellesProps['actuelles'];
  dépôtEnCours?: GarantiesFinancièresDépôtEnCoursProps['dépôt'];
  dateLimiteSoummission?: Iso8601DateTime;
  mainlevée?: GarantiesFinancièresActuellesProps['mainlevée'];
  historiqueMainlevée?: GarantiesFinancièresActuellesProps['historiqueMainlevée'];
  afficherInfoConditionsMainlevée: boolean;
  action?: 'soumettre' | 'enregistrer';
};

// meilleure gestion des actions à prévoir

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
            actions={actuelles.actions}
            mainlevée={mainlevée}
            historiqueMainlevée={historiqueMainlevée}
          />
        )}
        {dépôtEnCours && (
          <GarantiesFinancières
            garantiesFinancières={dépôtEnCours}
            identifiantProjet={identifiantProjet}
            actions={dépôtEnCours?.actions}
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
