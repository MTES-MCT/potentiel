import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { RejeterDemandeMainlevéeForm } from '@/app/laureats/[identifiant]/garanties-financieres/mainlevee/rejeter/RejeterDemandeMainlevée.form';
import { ActionsList } from '@/components/templates/ActionsList.template';

import { AnnulerDemandeMainlevée } from './annuler/AnnulerDemandeMainlevée.form';
import { PasserDemandeMainlevéeEnInstruction } from './passerEnInstruction/PasserDemandeMainlevéeEnInstruction.form';
import { AccorderDemandeMainlevée } from './accorder/AccorderDemandeMainlevée.form';

export type MainlevéeEnCoursProps = {
  mainlevée: PlainType<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursReadModel>;
};

export const MainlevéeEnCours: FC<MainlevéeEnCoursProps> = ({
  mainlevée: { demande, motif, accord, instruction },
}) => (
  <>
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
        </div>
      </div>
    )}
  </>
);

export type ActionsMainlevéeProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  actions: (
    | 'garantiesFinancières.mainlevée.annuler'
    | 'garantiesFinancières.mainlevée.démarrerInstruction'
    | 'garantiesFinancières.mainlevée.accorder'
    | 'garantiesFinancières.mainlevée.rejeter'
  )[];
  urlAppelOffre: string;
};

export const ActionsMainlevée: FC<ActionsMainlevéeProps> = ({
  identifiantProjet,
  actions,
  urlAppelOffre,
}) => {
  const identifiantProjetStr = IdentifiantProjet.bind(identifiantProjet).formatter();
  return (
    <ActionsList actionsListLength={1}>
      {actions.includes('garantiesFinancières.mainlevée.annuler') && (
        <AnnulerDemandeMainlevée identifiantProjet={identifiantProjetStr} />
      )}
      {actions.includes('garantiesFinancières.mainlevée.démarrerInstruction') && (
        <PasserDemandeMainlevéeEnInstruction identifiantProjet={identifiantProjetStr} />
      )}
      {actions.includes('garantiesFinancières.mainlevée.accorder') && (
        <AccorderDemandeMainlevée identifiantProjet={identifiantProjetStr} />
      )}
      {actions.includes('garantiesFinancières.mainlevée.rejeter') && (
        <RejeterDemandeMainlevéeForm identifiantProjet={identifiantProjetStr} />
      )}
      <Button
        priority="secondary"
        linkProps={{ href: Routes.GarantiesFinancières.détail(identifiantProjetStr) }}
      >
        Voir les Garanties Financières
      </Button>
      <Button linkProps={{ href: urlAppelOffre, target: '_blank' }} priority="secondary">
        Voir le cahier des charges
      </Button>
    </ActionsList>
  );
};
