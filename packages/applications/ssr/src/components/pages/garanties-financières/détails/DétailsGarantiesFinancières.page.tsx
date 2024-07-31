import { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import {
  GarantiesFinancières,
  GarantiesFinancièresProps,
} from '@/components/organisms/garantiesFinancières/GarantiesFinancières';
import {
  DépôtGarantiesFinancières,
  GarantiesFinancièresActuelles,
  GarantiesFinancièresArchivées,
} from '@/components/organisms/garantiesFinancières/types';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';

import { InfoBoxMainlevée } from './components/InfoBoxMainlevée';
import { InfoBoxSoumettreGarantiesFinancières } from './components/InfoBoxSoummettreGarantiesFinancières';
import { GarantiesFinancièresManquantes } from './components/GarantiesFinancièresManquantes';
import { HistoriqueMainlevéeRejetéeProps } from './components/HistoriqueMainlevéeRejetée';
import { MainlevéeEnCoursProps } from './components/MainlevéeEnCours';
import { Mainlevée } from './components/Mainlevée';
import { ArchivesGarantiesFinancières } from './components/ArchivesGarantiesFinancières';

export type DétailsGarantiesFinancièresPageProps = {
  identifiantProjet: string;
  contactPorteurs?: GarantiesFinancièresProps['contactPorteurs'];
  actuelles?: GarantiesFinancièresActuelles;
  dépôtEnCours?: DépôtGarantiesFinancières;
  archivesGarantiesFinancières?: Array<GarantiesFinancièresArchivées>;
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
  contactPorteurs,
  archivesGarantiesFinancières,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <TitrePageGarantiesFinancières title="Détail des garanties financières" />
    <>
      <div className="flex flex-col lg:flex-row gap-4">
        {actuelles && (
          <GarantiesFinancières
            garantiesFinancières={actuelles}
            identifiantProjet={identifiantProjet}
            contactPorteurs={contactPorteurs}
          />
        )}
        {dépôtEnCours && (
          <GarantiesFinancières
            garantiesFinancières={dépôtEnCours}
            identifiantProjet={identifiantProjet}
          />
        )}
      </div>

      {(mainlevée || (historiqueMainlevée && historiqueMainlevée.historique.length)) && (
        <Mainlevée
          mainlevéeEnCours={mainlevée}
          historiqueMainlevée={historiqueMainlevée}
          identifiantProjet={identifiantProjet}
        />
      )}

      {!dépôtEnCours && !actuelles && (
        <GarantiesFinancièresManquantes identifiantProjet={identifiantProjet} action={action} />
      )}
      {archivesGarantiesFinancières?.length && (
        <ArchivesGarantiesFinancières archives={archivesGarantiesFinancières} />
      )}

      {afficherInfoConditionsMainlevée && (
        <InfoBoxMainlevée identifiantProjet={identifiantProjet} />
      )}

      {action === 'soumettre' && (
        <InfoBoxSoumettreGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
    </>
  </PageTemplate>
);
