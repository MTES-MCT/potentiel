import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Role } from '@potentiel-domain/utilisateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { GarantiesFinancières } from '@/app/laureats/[identifiant]/garanties-financieres/components/GarantiesFinancières';
import { Heading2 } from '@/components/atoms/headings';

import { InfoBoxMainlevée } from './(mainlevée)/InfoBoxMainlevée';
import { GarantiesFinancièresManquantes } from './components/GarantiesFinancièresManquantes';
import { TitrePageGarantiesFinancières } from './components/TitrePageGarantiesFinancières';
import { MainlevéeEnCours } from './(mainlevée)/MainlevéeEnCours';
import { InfoBoxSoumettreDépôtGarantiesFinancières } from './(dépôt)/depot:soumettre/InfoBoxSoumettreDépôtGarantiesFinancières';
import { StatutGarantiesFinancièresBadge } from './StatutGarantiesFinancièresBadge';
import { GarantiesFinancièresActuellesActions } from './(actuelles)/GarantiesFinancièresActuellesActions';
import { DépôtGarantiesFinancièresActions } from './(dépôt)/DépôtGarantiesFinancièresActions';
import { SectionGarantiesFinancières } from './SectionGarantiesFinancières';
import { HistoriqueMainlevéeRejetée } from './(mainlevée)/(historique-main-levée-rejetée)/HistoriqueMainlevéeRejetée';
import { ArchivesGarantiesFinancières } from './(archives)/ArchivesGarantiesFinancières';

const actions = [
  'garantiesFinancières.actuelles.enregistrer',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.actuelles.modifier',
  'garantiesFinancières.mainlevée.demander',
  'garantiesFinancières.mainlevée.annuler',
  'garantiesFinancières.mainlevée.démarrerInstruction',
  'garantiesFinancières.mainlevée.accorder',
  'garantiesFinancières.mainlevée.rejeter',
  'garantiesFinancières.dépôt.soumettre',
  'garantiesFinancières.dépôt.modifier',
  'garantiesFinancières.dépôt.valider',
  'garantiesFinancières.dépôt.supprimer',
  'achèvement.attestationConformité.transmettre',
] satisfies Role.Policy[];
export type ActionGarantiesFinancières = (typeof actions)[number];

export type DétailsGarantiesFinancièresPageProps = {
  identifiantProjet: string;
  contactPorteurs: string[];
  actuelles: PlainType<
    Option.Type<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>
  >;
  dépôtEnCours: Option.Type<
    PlainType<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel>
  >;
  archivesGarantiesFinancières: PlainType<Lauréat.GarantiesFinancières.ListerArchivesGarantiesFinancièresReadModel>;
  mainlevée: Option.Type<
    PlainType<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursReadModel>
  >;
  mainlevéesRejetées: PlainType<Lauréat.GarantiesFinancières.ListerMainlevéeItemReadModel>[];
  motifMainlevée?: PlainType<Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.ValueType>;
  appelOffres: PlainType<AppelOffre.AppelOffreReadModel>;
  actions: ActionGarantiesFinancières[];
  infos: ('conditions-demande-mainlevée' | 'échues' | 'date-échéance-dépôt-passée')[];
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresPageProps> = ({
  identifiantProjet,
  actuelles,
  dépôtEnCours,
  actions,
  infos,
  mainlevée,
  mainlevéesRejetées,
  appelOffres,
  contactPorteurs,
  motifMainlevée,
  archivesGarantiesFinancières,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <TitrePageGarantiesFinancières title="Détail des garanties financières" />
    <>
      <div className="flex flex-col lg:flex-row gap-4">
        {Option.isSome(actuelles) && (
          <SectionGarantiesFinancières>
            <GarantiesFinancières
              title="Garanties financières actuelles"
              garantiesFinancières={actuelles}
              attestation={actuelles.attestation}
              statutBadge={<StatutGarantiesFinancièresBadge statut={actuelles.statut.statut} />}
              actions={actions}
            />
            <GarantiesFinancièresActuellesActions
              actions={actions}
              infos={infos}
              identifiantProjet={identifiantProjet}
              contactPorteurs={contactPorteurs}
              motif={motifMainlevée}
            />
          </SectionGarantiesFinancières>
        )}
        {Option.isSome(dépôtEnCours) && (
          <SectionGarantiesFinancières>
            <GarantiesFinancières
              title="Garanties financières à traiter"
              garantiesFinancières={dépôtEnCours}
              attestation={dépôtEnCours.attestation}
              actions={actions}
            />

            <DépôtGarantiesFinancièresActions
              identifiantProjet={identifiantProjet}
              actions={actions}
              infos={infos}
            />
          </SectionGarantiesFinancières>
        )}
      </div>

      {(Option.isSome(mainlevée) || mainlevéesRejetées.length > 0) && (
        <SectionGarantiesFinancières
          colorVariant={
            Option.match(mainlevée)
              .some(({ statut }) => statut.statut === 'accordé')
              .none(() => false)
              ? 'success'
              : 'info'
          }
        >
          <Heading2>Mainlevée des garanties financières</Heading2>
          <div className="flex flex-col lg:flex-row gap-4">
            {Option.isSome(mainlevée) && (
              <MainlevéeEnCours
                mainlevée={mainlevée}
                actions={actions}
                urlAppelOffre={appelOffres.cahiersDesChargesUrl}
              />
            )}
            {mainlevéesRejetées.length > 0 && (
              <HistoriqueMainlevéeRejetée mainlevéesRejetées={mainlevéesRejetées} />
            )}
          </div>
        </SectionGarantiesFinancières>
      )}

      {!dépôtEnCours && !actuelles && (
        <GarantiesFinancièresManquantes identifiantProjet={identifiantProjet} actions={actions} />
      )}

      {archivesGarantiesFinancières.length > 0 && (
        <ArchivesGarantiesFinancières archives={archivesGarantiesFinancières} />
      )}

      {infos.includes('conditions-demande-mainlevée') && (
        <InfoBoxMainlevée identifiantProjet={identifiantProjet} actions={actions} />
      )}

      {actions.includes('garantiesFinancières.dépôt.soumettre') && (
        <InfoBoxSoumettreDépôtGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
    </>
  </PageTemplate>
);
