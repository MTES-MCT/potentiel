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
import { DownloadDocument } from '../../../../atoms/form/DownloadDocument';
import { CorrigerRéponseSignée } from '../../mainlevée/corrigerRéponseSignée/CorrigerRéponseSignée';

export type MainlevéeEnCoursProps = {
  identifiantProjet: string;
  mainlevéeEnCours: {
    statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
    motif: GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.RawType;
    demandéLe: Iso8601DateTime;
    dernièreMiseÀJour: {
      date: Iso8601DateTime;
      par: string;
    };
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
      {mainlevéeEnCours.dernièreMiseÀJour.par && (
        <>
          {' '}
          par <span className="font-semibold">{mainlevéeEnCours.dernièreMiseÀJour.par}</span>
        </>
      )}
    </div>
    <div className="mt-5 mb-5 gap-2 text-base">
      <div>
        Mainlevée demandée le :{' '}
        <FormattedDate className="font-semibold" date={mainlevéeEnCours.demandéLe} />
      </div>
      <div>
        Motif :{' '}
        <span className="font-semibold">
          {mainlevéeEnCours.motif === 'projet-abandonné' ? `Abandon` : `Achèvement`} du projet
        </span>
      </div>
      {mainlevéeEnCours.instructionDémarréeLe && (
        <div>
          Instruction démarrée le :{' '}
          <FormattedDate className="font-semibold" date={mainlevéeEnCours.instructionDémarréeLe} />
        </div>
      )}
      {mainlevéeEnCours.accord.accordéeLe && (
        <div>
          Mainlevée accordée le :{' '}
          <FormattedDate className="font-semibold" date={mainlevéeEnCours.accord.accordéeLe} />
        </div>
      )}
      <div className="flex flex-col gap-1 justify-center">
        {mainlevéeEnCours.accord.courrierAccord && (
          <DownloadDocument
            format="pdf"
            label="Télécharger la réponse signée"
            url={Routes.Document.télécharger(mainlevéeEnCours.accord.courrierAccord)}
          />
        )}
        {mainlevéeEnCours.accord.courrierAccord &&
          mainlevéeEnCours.actions.includes('modifier-courrier-réponse-mainlevée-gf') && (
            <CorrigerRéponseSignée
              identifiantProjet={identifiantProjet}
              courrierRéponse={mainlevéeEnCours.accord.courrierAccord}
            />
          )}
      </div>
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
