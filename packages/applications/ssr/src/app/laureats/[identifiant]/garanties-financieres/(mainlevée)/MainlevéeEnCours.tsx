import { FC } from 'react';
import Link from 'next/link';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading3 } from '@/components/atoms/headings';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { RejeterDemandeMainlevéeForm } from '@/app/laureats/[identifiant]/garanties-financieres/(mainlevée)/rejeter/RejeterDemandeMainlevée.form';

import { DétailsGarantiesFinancièresPageProps } from '../DétailsGarantiesFinancières.page';

import { StatutMainlevéeBadge } from './StatutMainlevéeBadge';
import { AnnulerDemandeMainlevée } from './annuler/AnnulerDemandeMainlevée.form';
import { PasserDemandeMainlevéeEnInstruction } from './passerEnInstruction/PasserDemandeMainlevéeEnInstruction.form';
import { AccorderDemandeMainlevée } from './accorder/AccorderDemandeMainlevée.form';
import { CorrigerRéponseSignée } from './corrigerRéponseSignée/CorrigerRéponseSignée.form';

export type MainlevéeEnCoursProps = {
  mainlevée: PlainType<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursReadModel>;
  actions: DétailsGarantiesFinancièresPageProps['actions'];
  urlAppelOffre: string;
};

export const MainlevéeEnCours: FC<MainlevéeEnCoursProps> = ({
  mainlevée: { statut, demande, dernièreMiseÀJour, identifiantProjet, motif, accord, instruction },
  actions,
  urlAppelOffre,
}) => (
  <div className="p-3 flex-1">
    <div className="flex gap-2">
      <Heading3>Mainlevée</Heading3>
      <StatutMainlevéeBadge statut={statut.statut} />
    </div>
    <div className="text-xs italic">
      Dernière mise à jour le{' '}
      <FormattedDate className="font-semibold" date={dernièreMiseÀJour.date.date} />
    </div>
    <div className="mt-5 mb-5 gap-2 text-base">
      <div>
        Mainlevée demandée le :{' '}
        <FormattedDate className="font-semibold" date={demande.demandéeLe.date} /> par{' '}
        <span className="font-semibold">{demande.demandéePar.email}</span>
      </div>
      <div>
        Motif :{' '}
        <span className="font-semibold">
          {motif.motif === 'projet-abandonné' ? `Abandon` : `Achèvement`} du projet
        </span>
      </div>
      {instruction && (
        <div>
          Instruction démarrée le :{' '}
          <FormattedDate className="font-semibold" date={instruction.démarréeLe.date} /> par{' '}
          <span className="font-semibold">{instruction.démarréePar.email}</span>
        </div>
      )}
      {accord && (
        <div>
          <div>
            Mainlevée accordée le :{' '}
            <FormattedDate className="font-semibold" date={accord.accordéeLe.date} /> par{' '}
            <span className="font-semibold">{accord.accordéePar.email}</span>
          </div>
          <div className="flex flex-col gap-1 justify-center">
            <DownloadDocument
              format="pdf"
              label="Télécharger la réponse signée"
              url={Routes.Document.télécharger(
                DocumentProjet.bind(accord.courrierAccord).formatter(),
              )}
            />
            {actions.includes('garantiesFinancières.mainlevée.corrigerRéponseSignée') && (
              <CorrigerRéponseSignée
                identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
                courrierRéponseÀCorriger={DocumentProjet.bind(accord.courrierAccord).formatter()}
              />
            )}
          </div>
        </div>
      )}
    </div>
    <Actions
      identifiantProjet={identifiantProjet}
      actions={actions}
      urlAppelOffre={urlAppelOffre}
    />
  </div>
);

type ActionsProps = {
  identifiantProjet: MainlevéeEnCoursProps['mainlevée']['identifiantProjet'];
  actions: MainlevéeEnCoursProps['actions'];
  urlAppelOffre: MainlevéeEnCoursProps['urlAppelOffre'];
};

const Actions: FC<ActionsProps> = ({ identifiantProjet, actions, urlAppelOffre }) => {
  const identifiantProjetStr = IdentifiantProjet.bind(identifiantProjet).formatter();
  return (
    <div className="flex flex-col gap-2">
      {actions.includes('garantiesFinancières.mainlevée.annuler') && (
        <AnnulerDemandeMainlevée identifiantProjet={identifiantProjetStr} />
      )}
      {(actions.includes('garantiesFinancières.mainlevée.accorder') ||
        actions.includes('garantiesFinancières.mainlevée.rejeter') ||
        actions.includes('garantiesFinancières.mainlevée.démarrerInstruction')) && (
        <div>
          {actions.includes('garantiesFinancières.mainlevée.démarrerInstruction') && (
            <PasserDemandeMainlevéeEnInstruction identifiantProjet={identifiantProjetStr} />
          )}
          <div className="flex flex-col md:flex-row gap-3">
            {actions.includes('garantiesFinancières.mainlevée.accorder') && (
              <AccorderDemandeMainlevée identifiantProjet={identifiantProjetStr} />
            )}
            {actions.includes('garantiesFinancières.mainlevée.rejeter') && (
              <RejeterDemandeMainlevéeForm identifiantProjet={identifiantProjetStr} />
            )}
          </div>
          <p className="italic mt-4">
            Vous pouvez consulter le cahier des charges de l'appel d'offre du projet sur{' '}
            <Link href={urlAppelOffre} target="_blank">
              cette page de la CRE
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
};
