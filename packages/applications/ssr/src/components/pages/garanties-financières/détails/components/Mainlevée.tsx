import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading3 } from '@/components/atoms/headings';

import { DémarrerInstructionDemandeMainlevéeGarantiesFinancières } from '../../mainlevée/instruire/DémarrerInstructionDemandeMainlevéeGarantiesFinancières';
import { AccepterDemandeMainlevéeGarantiesFinancières } from '../../mainlevée/accorder/AccorderDemandeMainleveGarantiesFinancières';
import { RejeterDemandeMainlevéeGarantiesFinancières } from '../../mainlevée/rejeter/RejeterDemandeMainleveGarantiesFinancières';
import { AnnulerDemandeMainlevéeGarantiesFinancières } from '../../mainlevée/annuler/AnnulerDemandeMainlevéeGarantiesFinancières';
import { StatutMainlevéeBadge } from '../../../../molecules/mainlevée/StatutMainlevéeBadge';

export type MainlevéeProps = {
  identifiantProjet: string;
  mainlevée: {
    statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
    motif: GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.RawType;
    demandéLe: Iso8601DateTime;
    instructionDémarréeLe?: Iso8601DateTime;
    actions: Array<
      | 'instruire-demande-mainlevée-gf'
      | 'accepter-demande-mainlevée-gf'
      | 'rejeter-demande-mainlevée-gf'
      | 'annuler-demande-mainlevée-gf'
    >;
  };
};

// on affiche le statut
export const Mainlevée: FC<MainlevéeProps> = ({ mainlevée, identifiantProjet }) => (
  <>
    <Heading3>Mainlevée en cours</Heading3>
    <StatutMainlevéeBadge statut={mainlevée.statut} />
    {/* <div className="text-xs italic">
            Dernière mise à jour le{' '}
            <FormattedDate className="font-semibold" date={dernièreMiseÀJour.date} />
            {dernièreMiseÀJour.par && (
              <>
                {' '}
                par <span className="font-semibold">{dernièreMiseÀJour.par}</span>
              </>
            )}
          </div> */}
    <div className="mt-5 gap-2 text-base">
      <div>
        Le porteur de projet a déposé une demande de mainlevée en date du{' '}
        <FormattedDate date={mainlevée.demandéLe} /> suite à{' '}
        {mainlevée.motif === 'projet-abandonné' ? `l'abandon` : `l'achèvement`} du projet.
      </div>
      {mainlevée.instructionDémarréeLe && (
        <div>
          Instruction démarrée le :{' '}
          <FormattedDate className="font-semibold" date={mainlevée.instructionDémarréeLe} />
        </div>
      )}
      {/* {mainlevée.instructionDémarréeLe && (
        <div>
          Instruction démarrée le :{' '}
          <FormattedDate className="font-semibold" date={mainlevée.instructionDémarréeLe} />
        </div>
      )} */}
    </div>

    <Actions identifiantProjet={identifiantProjet} actions={mainlevée.actions} />
  </>
);

type ActionsProps = {
  identifiantProjet: MainlevéeProps['identifiantProjet'];
  actions: MainlevéeProps['mainlevée']['actions'];
};
const Actions: FC<ActionsProps> = ({ identifiantProjet, actions }) => {
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
                Vous pouvez consulter l'appel d'offres du projet en accédant à{' '}
                {/* <Link href={urlAppelOffre} target="_blank">
                  cette page de la CRE
                </Link> */}
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
