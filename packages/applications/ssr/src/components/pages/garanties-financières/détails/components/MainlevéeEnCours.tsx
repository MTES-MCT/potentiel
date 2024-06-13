import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
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
      | 'instruire-demande-mainlevée-gf'
      | 'accepter-demande-mainlevée-gf'
      | 'rejeter-demande-mainlevée-gf'
      | 'annuler-demande-mainlevée-gf'
    >;
  };
};

export const MainlevéeEnCours: FC<MainlevéeEnCoursProps> = ({ mainlevée, identifiantProjet }) => (
  <div className="mt-3 p-3 border border-dsfr-border-actionLow-blueFrance-default">
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
    <div className="flex flex-col md:flex-row gap-4">
      {actions.includes('annuler-demande-mainlevée-gf') && (
        <AnnulerDemandeMainlevéeGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('instruire-demande-mainlevée-gf') && (
        <>
          <Alert
            description={
              <span>
                Vous pouvez consulter l'appel d'offre du projet en accédant à{' '}
                <Link href={urlAppelOffre} target="_blank">
                  cette page de la CRE
                </Link>
              </span>
            }
            severity="info"
            small
            className="mb-4"
          />
          <DémarrerInstructionDemandeMainlevéeGarantiesFinancières
            identifiantProjet={identifiantProjet}
          />
        </>
      )}
      {actions.includes('accepter-demande-mainlevée-gf') && (
        <AccepterDemandeMainlevéeGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('rejeter-demande-mainlevée-gf') && (
        <RejeterDemandeMainlevéeGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
    </div>
  );
};
