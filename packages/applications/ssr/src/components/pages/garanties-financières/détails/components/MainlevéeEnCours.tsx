import { FC } from 'react';
import Link from 'next/link';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading3 } from '@/components/atoms/headings';

import { DémarrerInstructionDemandeMainlevéeGarantiesFinancières } from '../../mainlevée/instruire/DémarrerInstructionDemandeMainlevéeGarantiesFinancières';
import { AccepterDemandeMainlevéeGarantiesFinancières } from '../../mainlevée/accorder/AccorderDemandeMainleveGarantiesFinancières';
import { RejeterDemandeMainlevéeGarantiesFinancières } from '../../mainlevée/rejeter/RejeterDemandeMainleveGarantiesFinancières';
import { AnnulerDemandeMainlevéeGarantiesFinancières } from '../../mainlevée/annuler/AnnulerDemandeMainlevéeGarantiesFinancières';
import { StatutMainlevéeBadge } from '../../../../molecules/mainlevée/StatutMainlevéeBadge';

export type MainlevéeEnCoursProps = {
  identifiantProjet: string;
  mainlevée: {
    statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
    motif: GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.RawType;
    demandéLe: Iso8601DateTime;
    dernièreMiseÀJourLe: Iso8601DateTime;
    acceptéLe?: Iso8601DateTime;
    instructionDémarréeLe?: Iso8601DateTime;
    urlAppelOffre: string;
    actions: Array<
      | 'voir-appel-offre-info'
      | 'instruire-demande-mainlevée-gf'
      | 'accepter-ou-rejeter-demande-mainlevée-gf'
      | 'annuler-demande-mainlevée-gf'
    >;
  };
};

export const MainlevéeEnCours: FC<MainlevéeEnCoursProps> = ({ mainlevée, identifiantProjet }) => (
  <div className="mt-5 p-3 border border-dsfr-border-default-blueFrance-default">
    <Heading3>Mainlevée en cours</Heading3>
    <div className="text-xs italic">
      Dernière mise à jour le{' '}
      <FormattedDate className="font-semibold" date={mainlevée.dernièreMiseÀJourLe} />
    </div>
    <StatutMainlevéeBadge statut={mainlevée.statut} />
    <div className="mt-5 gap-2 text-base">
      <div>
        Mainlevée demandée le :{' '}
        <FormattedDate className="font-semibold" date={mainlevée.demandéLe} />
      </div>
      <div>
        Motif :{' '}
        <span className="font-semibold">
          {mainlevée.motif === 'projet-abandonné' ? `Abandon` : `Achèvement`} du projet
        </span>
      </div>
      {mainlevée.instructionDémarréeLe && (
        <div>
          Instruction démarrée le :{' '}
          <FormattedDate className="font-semibold" date={mainlevée.instructionDémarréeLe} />
        </div>
      )}
    </div>
    <Actions
      identifiantProjet={identifiantProjet}
      actions={mainlevée.actions}
      urlAppelOffre={mainlevée.urlAppelOffre}
    />
  </div>
);

type ActionsProps = {
  identifiantProjet: MainlevéeEnCoursProps['identifiantProjet'];
  actions: MainlevéeEnCoursProps['mainlevée']['actions'];
  urlAppelOffre: MainlevéeEnCoursProps['mainlevée']['urlAppelOffre'];
};

const Actions: FC<ActionsProps> = ({ identifiantProjet, actions, urlAppelOffre }) => {
  return (
    <div className="flex flex-col gap-2">
      {actions.includes('annuler-demande-mainlevée-gf') && (
        <AnnulerDemandeMainlevéeGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('instruire-demande-mainlevée-gf') && (
        <DémarrerInstructionDemandeMainlevéeGarantiesFinancières
          identifiantProjet={identifiantProjet}
        />
      )}
      {actions.includes('accepter-ou-rejeter-demande-mainlevée-gf') && (
        <div className="flex flex-col md:flex-row gap-3">
          <AccepterDemandeMainlevéeGarantiesFinancières identifiantProjet={identifiantProjet} />
          <RejeterDemandeMainlevéeGarantiesFinancières identifiantProjet={identifiantProjet} />
        </div>
      )}
      {actions.includes('voir-appel-offre-info') && (
        <p className="italic">
          Vous pouvez consulter l'appel d'offre du projet en accédant à{' '}
          <Link href={urlAppelOffre} target="_blank">
            cette page de la CRE
          </Link>
        </p>
      )}
    </div>
  );
};
