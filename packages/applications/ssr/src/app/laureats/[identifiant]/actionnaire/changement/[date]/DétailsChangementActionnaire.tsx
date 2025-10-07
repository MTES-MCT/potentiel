import { FC } from 'react';

import { DateTime, Email } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading2 } from '@/components/atoms/headings';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemande';

import { DétailsActionnairePageProps } from './DétailsActionnaire.page';

export type DétailsChangementActionnaireProps = Pick<DétailsActionnairePageProps, 'demande'>;

export const DétailsChangementActionnaire: FC<DétailsChangementActionnaireProps> = ({
  demande,
}) => {
  const estUneInformationEnregistrée = Lauréat.Actionnaire.StatutChangementActionnaire.bind(
    demande.statut,
  ).estInformationEnregistrée();

  return (
    <div className="flex flex-col gap-4">
      <Heading2>
        {estUneInformationEnregistrée
          ? "Changement d'actionnaire(s)"
          : "Demande de changement d'actionnaire(s)"}
      </Heading2>
      <div className="flex flex-col">
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
        {Lauréat.Actionnaire.StatutChangementActionnaire.bind(demande.statut).estDemandé() && (
          <ChangementDemandé demandéeLe={demande.demandéeLe} demandéePar={demande.demandéePar} />
        )}
        {estUneInformationEnregistrée && (
          <InformationEnregistrée
            demandéeLe={demande.demandéeLe}
            demandéePar={demande.demandéePar}
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

type ChangementProps = Pick<
  PlainType<Lauréat.Actionnaire.ConsulterChangementActionnaireReadModel['demande']>,
  'raison' | 'pièceJustificative' | 'nouvelActionnaire'
>;

const Changement: FC<ChangementProps> = ({ nouvelActionnaire, pièceJustificative, raison }) => (
  <>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Société mère</div>
      <div>{nouvelActionnaire}</div>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Raison du changement :</div>
      <div>{raison}</div>
    </div>
    {pièceJustificative && (
      <div className="flex gap-2">
        <div className="font-semibold whitespace-nowrap">Pièce(s) justificative(s) :</div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format={pièceJustificative.format}
          url={Routes.Document.télécharger(DocumentProjet.bind(pièceJustificative).formatter())}
        />
      </div>
    )}
  </>
);

const InformationEnregistrée: FC<ChangementDemandéProps> = ({ demandéeLe, demandéePar }) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Modifié le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(demandéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(demandéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Statut :</div>{' '}
      <StatutDemandeBadge
        statut={Lauréat.Actionnaire.StatutChangementActionnaire.informationEnregistrée.statut}
      />
    </div>
  </div>
);

type ChangementDemandéProps = Pick<
  PlainType<Lauréat.Actionnaire.ConsulterChangementActionnaireReadModel['demande']>,
  'demandéeLe' | 'demandéePar'
>;

const ChangementDemandé: FC<ChangementDemandéProps> = ({ demandéeLe, demandéePar }) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Demandé le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(demandéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(demandéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Statut :</div>{' '}
      <StatutDemandeBadge statut={Lauréat.Actionnaire.StatutChangementActionnaire.demandé.statut} />
    </div>
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
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Accordée le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(accordéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(accordéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Statut :</div>{' '}
      <StatutDemandeBadge statut={Lauréat.Actionnaire.StatutChangementActionnaire.accordé.statut} />
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
  </div>
);

type ChangementRejetéProps = NonNullable<
  PlainType<Lauréat.Actionnaire.ConsulterChangementActionnaireReadModel['demande']>['rejet']
>;

const ChangementRejeté: FC<ChangementRejetéProps> = ({ rejetéeLe, rejetéePar, réponseSignée }) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs italic">
      Rejetée le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(rejetéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(rejetéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Statut :</div>{' '}
      <StatutDemandeBadge statut={Lauréat.Actionnaire.StatutChangementActionnaire.rejeté.statut} />
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
  </div>
);
