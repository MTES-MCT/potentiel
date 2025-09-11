import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { GarantiesFinancières } from '@/app/laureats/[identifiant]/garanties-financieres/components/GarantiesFinancières';

import { InfoBoxMainlevée } from './(mainlevée)/InfoBoxMainlevée';
import { GarantiesFinancièresManquantes } from './components/GarantiesFinancièresManquantes';
import { TitrePageGarantiesFinancières } from './components/TitrePageGarantiesFinancières';
import { MainlevéeEnCours } from './(mainlevée)/MainlevéeEnCours';
import { InfoBoxSoumettreDépôtGarantiesFinancières } from './(dépôt)/depot:soumettre/InfoBoxSoumettreDépôtGarantiesFinancières';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Heading2 } from '@/components/atoms/headings';
import { StatutGarantiesFinancièresBadge } from './StatutGarantiesFinancièresBadge';
import { GarantiesFinancièresActuellesActions } from './(actuelles)/GarantiesFinancièresActuellesActions';
import { DépôtGarantiesFinancièresActions } from './(dépôt)/DépôtGarantiesFinancièresActions';
import { SectionGarantiesFinancières } from './SectionGarantiesFinancières';
import { Role } from '@potentiel-domain/utilisateur';

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
  // archivesGarantiesFinancières?: Array<GarantiesFinancièresArchivées>;
  mainlevée: Option.Type<
    PlainType<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursReadModel>
  >;
  motifMainlevée?: PlainType<Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.ValueType>;
  // historiqueMainlevée: Option.Type<
  //   PlainType<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursReadModel>
  // >;
  actions: ActionGarantiesFinancières[];
  infos: ('demande-mainlevée' | 'échues' | 'date-échéance-dépôt-passée')[];
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresPageProps> = ({
  identifiantProjet,
  actuelles,
  dépôtEnCours,
  actions,
  infos,
  mainlevée,
  // historiqueMainlevée,
  contactPorteurs,
  motifMainlevée,
  // archivesGarantiesFinancières,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <TitrePageGarantiesFinancières title="Détail des garanties financières" />
    <>
      <div className="flex flex-col lg:flex-row gap-4">
        {Option.isSome(actuelles) && (
          <SectionGarantiesFinancières
            content={
              <GarantiesFinancières
                title="Garanties Financières actuelles"
                garantiesFinancières={actuelles}
                attestation={actuelles.attestation}
                statutBadge={<StatutGarantiesFinancièresBadge statut={actuelles.statut.statut} />}
                actions={actions}
              />
            }
            actions={
              <GarantiesFinancièresActuellesActions
                actions={actions}
                infos={infos}
                identifiantProjet={identifiantProjet}
                contactPorteurs={contactPorteurs}
                motif={motifMainlevée}
              />
            }
          />
        )}
        {Option.isSome(dépôtEnCours) && (
          <SectionGarantiesFinancières
            content={
              <GarantiesFinancières
                title="Garanties Financières à traiter"
                garantiesFinancières={dépôtEnCours}
                attestation={dépôtEnCours.attestation}
                actions={actions}
              />
            }
            actions={
              <DépôtGarantiesFinancièresActions
                identifiantProjet={identifiantProjet}
                actions={actions}
                infos={infos}
              />
            }
          />
        )}
      </div>

      {Option.isSome(mainlevée) && (
        <SectionGarantiesFinancières
          content={
            <div className="flex flex-col">
              <Heading2>Demande de mainlevée en cours</Heading2>
              <div className="flex">
                <MainlevéeEnCours mainlevée={mainlevée} actions={actions} urlAppelOffre={'TODO'} />
              </div>
            </div>
          }
          actions={<div />}
        />
      )}

      {!dépôtEnCours && !actuelles && (
        <GarantiesFinancièresManquantes identifiantProjet={identifiantProjet} actions={actions} />
      )}

      {/* {archivesGarantiesFinancières?.length && (
        <ArchivesGarantiesFinancières archives={archivesGarantiesFinancières} />
      )} */}

      {infos.includes('demande-mainlevée') && (
        <InfoBoxMainlevée identifiantProjet={identifiantProjet} actions={actions} />
      )}

      {actions.includes('garantiesFinancières.dépôt.soumettre') && (
        <InfoBoxSoumettreDépôtGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
    </>
  </PageTemplate>
);
