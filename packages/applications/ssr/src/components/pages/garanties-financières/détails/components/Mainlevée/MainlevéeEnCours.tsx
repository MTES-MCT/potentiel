import { FC } from 'react';
import Link from 'next/link';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading3 } from '@/components/atoms/headings';

import { DémarrerInstructionDemandeMainlevéeGarantiesFinancières } from '../../../mainlevée/instruire/DémarrerInstructionDemandeMainlevéeGarantiesFinancières';
import { AccorderDemandeMainlevéeGarantiesFinancières } from '../../../mainlevée/accorder/AccorderDemandeMainlevéeGarantiesFinancières';
import { RejeterDemandeMainlevéeGarantiesFinancières } from '../../../mainlevée/rejeter/RejeterDemandeMainleveGarantiesFinancières.form';
import { AnnulerDemandeMainlevéeGarantiesFinancières } from '../../../mainlevée/annuler/AnnulerDemandeMainlevéeGarantiesFinancières';
import { StatutMainlevéeBadge } from '../../../../../molecules/mainlevée/StatutMainlevéeBadge';

import { MainlevéeEnCoursAccord } from './MainlevéeEnCoursAccord';
import { MainlevéeEnCoursInstruction } from './MainlevéeEnCoursInstruction';

export type MainlevéeEnCoursProps = {
  identifiantProjet: string;
  mainlevéeEnCours: {
    statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
    motif: Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.RawType;
    dernièreMiseÀJour: {
      date: Iso8601DateTime;
      par: string;
    };
    demande: {
      date: Iso8601DateTime;
      par: Email.RawType;
    };
    instruction?: {
      date: Iso8601DateTime;
      par: Email.RawType;
    };
    accord?: {
      date: Iso8601DateTime;
      par: Email.RawType;
      courrierAccord: string;
    };
    urlAppelOffre: string;
    actions: Array<
      | 'voir-appel-offre-info'
      | 'instruire-demande-mainlevée-gf'
      | 'accorder-ou-rejeter-demande-mainlevée-gf'
      | 'annuler-demande-mainlevée-gf'
      | 'modifier-courrier-réponse-mainlevée-gf'
    >;
  };
};

export const MainlevéeEnCours: FC<MainlevéeEnCoursProps> = ({
  mainlevéeEnCours,
  identifiantProjet,
}) => (
  <div className="p-3 flex-1">
    <div className="flex gap-2">
      <Heading3>Mainlevée</Heading3>
      <StatutMainlevéeBadge statut={mainlevéeEnCours.statut} />
    </div>
    <div className="text-xs italic">
      Dernière mise à jour le{' '}
      <FormattedDate className="font-semibold" date={mainlevéeEnCours.dernièreMiseÀJour.date} />
    </div>
    <div className="mt-5 mb-5 gap-2 text-base">
      <div>
        Mainlevée demandée le :{' '}
        <FormattedDate className="font-semibold" date={mainlevéeEnCours.demande.date} /> par{' '}
        <span className="font-semibold">{mainlevéeEnCours.demande.par}</span>
      </div>
      <div>
        Motif :{' '}
        <span className="font-semibold">
          {mainlevéeEnCours.motif === 'projet-abandonné' ? `Abandon` : `Achèvement`} du projet
        </span>
      </div>
      {mainlevéeEnCours.instruction && (
        <MainlevéeEnCoursInstruction instruction={mainlevéeEnCours.instruction} />
      )}
      {mainlevéeEnCours.accord && (
        <MainlevéeEnCoursAccord
          identifiantProjet={identifiantProjet}
          actions={mainlevéeEnCours.actions}
          accord={mainlevéeEnCours.accord}
        />
      )}
    </div>
    <Actions
      identifiantProjet={identifiantProjet}
      actions={mainlevéeEnCours.actions}
      urlAppelOffre={mainlevéeEnCours.urlAppelOffre}
    />
  </div>
);

type ActionsProps = {
  identifiantProjet: MainlevéeEnCoursProps['identifiantProjet'];
  actions: MainlevéeEnCoursProps['mainlevéeEnCours']['actions'];
  urlAppelOffre: MainlevéeEnCoursProps['mainlevéeEnCours']['urlAppelOffre'];
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
      {actions.includes('accorder-ou-rejeter-demande-mainlevée-gf') && (
        <div className="flex flex-col md:flex-row gap-3">
          <AccorderDemandeMainlevéeGarantiesFinancières identifiantProjet={identifiantProjet} />
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
