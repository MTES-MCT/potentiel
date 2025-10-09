import { FC } from 'react';

import { DateTime, Email } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading2, Heading5 } from '@/components/atoms/headings';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';
import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';

import { DétailsActionnairePageProps } from './DétailsActionnaire.page';

export type DétailsChangementActionnaireProps = Pick<DétailsActionnairePageProps, 'demande'>;

export const DétailsChangementActionnaire: FC<DétailsChangementActionnaireProps> = ({
  demande,
}) => {
  return demande.statut.statut === 'information-enregistrée' ? (
    <DétailsChangement
      title="Changement d'actionnaire(s)"
      détailsSpécifiques={<DétailsActionnaire nouvelActionnaire={demande.nouvelActionnaire} />}
      changement={{
        enregistréPar: demande.demandéePar,
        enregistréLe: demande.demandéeLe,
        raison: demande.raison,
        pièceJustificative: demande.pièceJustificative,
      }}
    />
  ) : (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row gap-4">
          <Heading2>Demande de changement d'actionnaire(s)</Heading2>
          <StatutDemandeBadge statut={demande.statut.statut} />
        </div>
        <div className="text-xs italic">
          Demandé le{' '}
          <FormattedDate
            className="font-medium"
            date={DateTime.bind(demande.demandéeLe).formatter()}
          />{' '}
          par <span className="font-medium">{Email.bind(demande.demandéePar).formatter()}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {demande.accord && (
          <ChangementAccordé
            accordéeLe={demande.accord.accordéeLe}
            accordéePar={demande.accord.accordéePar}
            réponseSignée={demande.accord.réponseSignée}
          />
        )}
        {demande.rejet && (
          <ChangementRejeté
            rejetéeLe={demande.rejet.rejetéeLe}
            rejetéePar={demande.rejet.rejetéePar}
            réponseSignée={demande.rejet.réponseSignée}
          />
        )}
        <Changement
          nouvelActionnaire={demande.nouvelActionnaire}
          raison={demande.raison}
          pièceJustificative={demande.pièceJustificative}
        />
      </div>
    </div>
  );
};

const DétailsActionnaire = ({ nouvelActionnaire }: { nouvelActionnaire: string }) => (
  <>
    <div className="font-medium whitespace-nowrap">Société mère</div>
    <div>{nouvelActionnaire}</div>
  </>
);

type ChangementProps = Pick<
  PlainType<Lauréat.Actionnaire.ConsulterChangementActionnaireReadModel['demande']>,
  'raison' | 'pièceJustificative' | 'nouvelActionnaire'
>;

const Changement: FC<ChangementProps> = ({ nouvelActionnaire, pièceJustificative, raison }) => (
  <div>
    <Heading5>Détails de la demande</Heading5>
    <div className="flex gap-2">
      <DétailsActionnaire nouvelActionnaire={nouvelActionnaire} />
    </div>
    <div className="flex gap-2">
      <div className="font-medium whitespace-nowrap">Raison du changement :</div>
      <div>{raison}</div>
    </div>
    {pièceJustificative && (
      <div className="flex gap-2">
        <div className="font-medium whitespace-nowrap">Pièce(s) justificative(s) :</div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format={pièceJustificative.format}
          url={Routes.Document.télécharger(DocumentProjet.bind(pièceJustificative).formatter())}
        />
      </div>
    )}
  </div>
);

type ChangementAccordéProps = NonNullable<
  PlainType<Lauréat.Actionnaire.ConsulterChangementActionnaireReadModel['demande']>['accord']
>;

const ChangementAccordé: FC<ChangementAccordéProps> = ({
  accordéeLe,
  accordéePar,
  réponseSignée,
}) => (
  <div>
    <Heading5>Accord</Heading5>
    <div>
      Accordée le{' '}
      <FormattedDate className="font-medium" date={DateTime.bind(accordéeLe).formatter()} />, par{' '}
      <span className="font-medium">{Email.bind(accordéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-medium whitespace-nowrap">Réponse signée :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format={réponseSignée.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(réponseSignée).formatter())}
      />
    </div>
  </div>
);

type ChangementRejetéProps = NonNullable<
  PlainType<Lauréat.Actionnaire.ConsulterChangementActionnaireReadModel['demande']>['rejet']
>;

const ChangementRejeté: FC<ChangementRejetéProps> = ({ rejetéeLe, rejetéePar, réponseSignée }) => (
  <div>
    <Heading5>Rejet</Heading5>
    <div>
      Rejetée le{' '}
      <FormattedDate className="font-medium" date={DateTime.bind(rejetéeLe).formatter()} />, par{' '}
      <span className="font-medium">{Email.bind(rejetéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-medium whitespace-nowrap">Réponse signée :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format={réponseSignée.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(réponseSignée).formatter())}
      />
    </div>
  </div>
);
