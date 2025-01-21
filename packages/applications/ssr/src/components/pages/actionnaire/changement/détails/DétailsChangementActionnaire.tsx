import { FC } from 'react';

import { DateTime, Email } from '@potentiel-domain/common';
import { Actionnaire } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { PlainType } from '@potentiel-domain/core';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading2 } from '@/components/atoms/headings';

import { StatutChangementActionnaireBadge } from '../StatutChangementActionnaireBadge';

import { DétailsActionnairePageProps } from './DétailsActionnaire.page';

export type DétailsChangementActionnaireProps = Pick<
  DétailsActionnairePageProps,
  'actionnaire' | 'demande'
>;

export const DétailsChangementActionnaire: FC<DétailsChangementActionnaireProps> = ({
  actionnaire,
  demande,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Heading2>Détails de la demande en cours de modification de l’actionnariat</Heading2>
      {demande && actionnaire ? (
        <div className="flex flex-col gap-4">
          <Heading2 className="mb-4">Contexte de la demande</Heading2>
          <div className="flex flex-col gap-4">
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
              {Actionnaire.StatutChangementActionnaire.bind(demande.statut).estDemandé() && (
                <ChangementDemandé
                  demandéeLe={demande.demandéeLe}
                  demandéePar={demande.demandéePar}
                />
              )}
            </div>
          </div>
          <Changement
            actionnaire={actionnaire}
            raison={demande.raison}
            pièceJustificative={demande.pièceJustificative}
          />
        </div>
      ) : (
        <span>Pas de demande en cours</span>
      )}
    </div>
  );
};

type ChangementProps = Pick<
  PlainType<Actionnaire.ConsulterChangementActionnaireReadModel['demande']>,
  'raison' | 'pièceJustificative'
> & { actionnaire: PlainType<Actionnaire.ConsulterChangementActionnaireReadModel['actionnaire']> };

const Changement: FC<ChangementProps> = ({ actionnaire, pièceJustificative, raison }) => (
  <>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Société mère</div>
      <div>{actionnaire.demandé}</div>
    </div>
    {actionnaire.demandé !== actionnaire.actuel && (
      <div className="flex gap-2">
        <div className="italic whitespace-nowrap">Ancienne société mère</div>
        <div>{actionnaire.actuel}</div>
      </div>
    )}
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Raison du changement :</div>
      <div>{raison}</div>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Pièce(s) justificative(s) :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la pièce justificative"
        format={pièceJustificative.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(pièceJustificative).formatter())}
      />
    </div>
  </>
);

type ChangementDemandéProps = Pick<
  PlainType<Actionnaire.ConsulterChangementActionnaireReadModel['demande']>,
  'demandéeLe' | 'demandéePar'
>;

const ChangementDemandé: FC<ChangementDemandéProps> = ({ demandéeLe, demandéePar }) => (
  <>
    <div className="text-xs italic">
      Demandé le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(demandéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(demandéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Statut :</div>{' '}
      <StatutChangementActionnaireBadge
        statut={Actionnaire.StatutChangementActionnaire.demandé.statut}
      />
    </div>
  </>
);

type ChangementAccordéProps = NonNullable<
  PlainType<Actionnaire.ConsulterChangementActionnaireReadModel['demande']>['accord']
>;

const ChangementAccordé: FC<ChangementAccordéProps> = ({
  accordéeLe,
  accordéePar,
  réponseSignée,
}) => (
  <>
    <div className="text-xs italic">
      Accordée le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(accordéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(accordéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Statut :</div>{' '}
      <StatutChangementActionnaireBadge
        statut={Actionnaire.StatutChangementActionnaire.accordé.statut}
      />
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Réponse signée :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format={réponseSignée.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(réponseSignée).formatter())}
      />
    </div>
  </>
);

type ChangementRejetéProps = NonNullable<
  PlainType<Actionnaire.ConsulterChangementActionnaireReadModel['demande']>['rejet']
>;

const ChangementRejeté: FC<ChangementRejetéProps> = ({ rejetéeLe, rejetéePar, réponseSignée }) => (
  <>
    <div className="text-xs italic">
      Rejetée le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(rejetéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(rejetéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Statut :</div>{' '}
      <StatutChangementActionnaireBadge
        statut={Actionnaire.StatutChangementActionnaire.rejeté.statut}
      />
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Réponse signée :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format={réponseSignée.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(réponseSignée).formatter())}
      />
    </div>
  </>
);
