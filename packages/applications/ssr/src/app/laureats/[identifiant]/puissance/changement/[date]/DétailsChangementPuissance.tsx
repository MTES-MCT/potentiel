import { FC } from 'react';

import { DateTime, Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { PlainType } from '@potentiel-domain/core';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading2, Heading5 } from '@/components/atoms/headings';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';
import { DétailsInformationEnregistrée } from '@/components/organisms/demande/DétailsInformationEnregistrée';

import { DétailsPuissancePageProps } from './DétailsPuissance.page';

export type DétailsChangementPuissanceProps = {
  demande: DétailsPuissancePageProps['demande'];
  unitéPuissance: DétailsPuissancePageProps['unitéPuissance'];
  puissanceInitiale: DétailsPuissancePageProps['puissanceInitiale'];
};

export const DétailsChangementPuissance: FC<DétailsChangementPuissanceProps> = ({
  demande,
  unitéPuissance,
  puissanceInitiale,
}) => {
  const statut = Lauréat.Puissance.StatutChangementPuissance.bind(demande.statut.statut);

  return statut.estInformationEnregistrée() ? (
    <DétailsInformationEnregistrée
      title="Changement de puissance"
      détailsSpécifiques={
        <DétailsPuissance
          unitéPuissance={unitéPuissance}
          puissanceInitiale={puissanceInitiale}
          nouvellePuissance={demande.nouvellePuissance}
        />
      }
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
          <Heading2>Demande de changement de puissance</Heading2>
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
        nouvellePuissance={demande.nouvellePuissance}
        raison={demande.raison}
        pièceJustificative={demande.pièceJustificative}
        unitéPuissance={unitéPuissance}
        puissanceInitiale={puissanceInitiale}
      />
    </div>
  );
};

const DétailsPuissance = ({
  unitéPuissance,
  puissanceInitiale,
  nouvellePuissance,
}: Pick<ChangementProps, 'unitéPuissance' | 'puissanceInitiale' | 'nouvellePuissance'>) => (
  <>
    <div>
      <span className="font-medium">Puissance demandée</span> : {nouvellePuissance} {unitéPuissance}
    </div>
    <div>
      <span className="font-medium">Puissance initiale</span> : {puissanceInitiale} {unitéPuissance}
    </div>
  </>
);

type ChangementProps = {
  raison: DétailsChangementPuissanceProps['demande']['raison'];
  pièceJustificative: DétailsChangementPuissanceProps['demande']['pièceJustificative'];
  nouvellePuissance: DétailsChangementPuissanceProps['demande']['nouvellePuissance'];
  unitéPuissance: DétailsChangementPuissanceProps['unitéPuissance'];
  puissanceInitiale: DétailsChangementPuissanceProps['puissanceInitiale'];
};

const Changement: FC<ChangementProps> = ({
  nouvellePuissance,
  pièceJustificative,
  raison,
  unitéPuissance,
  puissanceInitiale,
}) => (
  <div className="flex flex-col">
    <Heading5>Détails de la demande</Heading5>
    <DétailsPuissance
      unitéPuissance={unitéPuissance}
      puissanceInitiale={puissanceInitiale}
      nouvellePuissance={nouvellePuissance}
    />
    {raison && (
      <div className="flex gap-2">
        <div className="font-medium whitespace-nowrap">Raison du changement :</div>
        <div>{raison}</div>
      </div>
    )}
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
  PlainType<Lauréat.Puissance.ConsulterChangementPuissanceReadModel['demande']['accord']>
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
    {réponseSignée && (
      <div className="flex gap-2">
        <div className="font-medium whitespace-nowrap">Réponse signée :</div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la réponse signée"
          format={réponseSignée.format}
          url={Routes.Document.télécharger(DocumentProjet.bind(réponseSignée).formatter())}
        />
      </div>
    )}
  </div>
);

type ChangementRejetéProps = NonNullable<
  PlainType<Lauréat.Puissance.ConsulterChangementPuissanceReadModel['demande']['rejet']>
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
