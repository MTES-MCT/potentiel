import type { FC } from 'react';

import type { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import {
  GarantiesFinancières,
  type GarantiesFinancièresProps,
} from '@/app/laureats/[identifiant]/garanties-financieres/components/GarantiesFinancières';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import type { GarantiesFinancièresActuelles } from './(actuelles)/garantiesFinancièresActuelles.type';
import { ArchivesGarantiesFinancières } from './(archives)/ArchivesGarantiesFinancières';
import type { GarantiesFinancièresArchivées } from './(archives)/garantiesFInancières.type';
import { InfoBoxSoumettreDépôtGarantiesFinancières } from './(dépôt)/depot:soumettre/InfoBoxSoumettreDépôtGarantiesFinancières';
import type { DépôtGarantiesFinancières } from './(dépôt)/dépôtGarantiesFinancières.type';
import { Mainlevée } from './(mainlevée)';
import type { HistoriqueMainlevéeRejetéeProps } from './(mainlevée)/(historique-main-levée-rejetée)/HistoriqueMainlevéeRejetée';
import { InfoBoxMainlevée } from './(mainlevée)/InfoBoxMainlevée';
import type { MainlevéeEnCoursProps } from './(mainlevée)/MainlevéeEnCours';
import { GarantiesFinancièresManquantes } from './components/GarantiesFinancièresManquantes';
import { TitrePageGarantiesFinancières } from './components/TitrePageGarantiesFinancières';

export type DétailsGarantiesFinancièresPageProps = {
  identifiantProjet: string;
  contactPorteurs?: GarantiesFinancièresProps['contactPorteurs'];
  actuelles?: GarantiesFinancièresActuelles;
  dépôtEnCours?: DépôtGarantiesFinancières;
  archivesGarantiesFinancières?: Array<GarantiesFinancièresArchivées>;
  dateLimiteSoummission?: Iso8601DateTime;
  mainlevée?: MainlevéeEnCoursProps['mainlevéeEnCours'];
  historiqueMainlevée?: HistoriqueMainlevéeRejetéeProps['historiqueMainlevée'];
  infoBoxMainlevée: {
    afficher: boolean;
    actions?: 'transmettre-attestation-conformité';
  };
  infoBoxGarantiesFinancières: {
    afficher: boolean;
  };
  action?: 'soumettre' | 'enregistrer';
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresPageProps> = ({
  identifiantProjet,
  actuelles,
  dépôtEnCours,
  action,
  mainlevée,
  historiqueMainlevée,
  infoBoxMainlevée,
  infoBoxGarantiesFinancières,
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

      {infoBoxMainlevée.afficher && (
        <InfoBoxMainlevée
          actions={infoBoxMainlevée.actions}
          identifiantProjet={identifiantProjet}
        />
      )}

      {infoBoxGarantiesFinancières.afficher && (
        <InfoBoxSoumettreDépôtGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
    </>
  </PageTemplate>
);
