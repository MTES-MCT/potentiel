import { FC } from 'react';
import Link from 'next/link';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading3 } from '@/components/atoms/headings';

import { DémarrerInstructionDemandeMainlevéeGarantiesFinancières } from '../../mainlevée/instruire/DémarrerInstructionDemandeMainlevéeGarantiesFinancières';
import { AccorderDemandeMainlevéeGarantiesFinancières } from '../../mainlevée/accorder/AccorderDemandeMainlevéeGarantiesFinancières';
import { RejeterDemandeMainlevéeGarantiesFinancières } from '../../mainlevée/rejeter/RejeterDemandeMainleveGarantiesFinancières';
import { AnnulerDemandeMainlevéeGarantiesFinancières } from '../../mainlevée/annuler/AnnulerDemandeMainlevéeGarantiesFinancières';
import { StatutMainlevéeBadge } from '../../../../molecules/mainlevée/StatutMainlevéeBadge';
import { InputDownload } from '../../../../atoms/form/InputDownload';

export type MainlevéeEnCoursProps = {
  identifiantProjet: string;
  mainlevée: {
    statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
    motif: GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.RawType;
    demandéLe: Iso8601DateTime;
    dernièreMiseÀJourLe: Iso8601DateTime;
    instructionDémarréeLe?: Iso8601DateTime;
    accord: {
      accordéeLe?: Iso8601DateTime;
      courrierAccord?: string;
    };
    urlAppelOffre: string;
    actions: Array<
      | 'voir-appel-offre-info'
      | 'instruire-demande-mainlevée-gf'
      | 'accorder-ou-rejeter-demande-mainlevée-gf'
      | 'annuler-demande-mainlevée-gf'
    >;
  };
};

export const MainlevéeEnCours: FC<MainlevéeEnCoursProps> = ({ mainlevée, identifiantProjet }) => (
  <div className="p-3 flex-1">
    <div className="flex gap-2">
      <Heading3>Mainlevée</Heading3>
      <StatutMainlevéeBadge statut={mainlevée.statut} />
    </div>
    <div className="text-xs italic">
      Dernière mise à jour le{' '}
      <FormattedDate className="font-semibold" date={mainlevée.dernièreMiseÀJourLe} />
    </div>
    <div className="mt-5 mb-5 gap-2 text-base">
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
      {mainlevée.accord.accordéeLe && (
        <div>
          Mainlevée accordée le :{' '}
          <FormattedDate className="font-semibold" date={mainlevée.accord.accordéeLe} />
        </div>
      )}
      {mainlevée.accord.courrierAccord && (
        <InputDownload
          ariaLabel="Télécharger la réponse signée"
          details="Au format .pdf"
          label="Télécharger la réponse signée"
          linkProps={{
            href: Routes.Document.télécharger(mainlevée.accord.courrierAccord),
          }}
        />
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
