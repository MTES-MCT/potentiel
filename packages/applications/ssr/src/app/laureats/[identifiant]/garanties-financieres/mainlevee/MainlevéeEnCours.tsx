import { FC } from 'react';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = [
  'garantiesFinancières.mainlevée.annuler',
  'garantiesFinancières.mainlevée.démarrerInstruction',
  'garantiesFinancières.mainlevée.accorder',
  'garantiesFinancières.mainlevée.rejeter',
] satisfies Role.Policy[];

export type ActionMainlevée = (typeof actions)[number];

export type ActionsMainlevéeProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  actions: ActionMainlevée[];
  urlAppelOffre: string;
};

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
