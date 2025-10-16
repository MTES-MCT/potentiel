import { FC } from 'react';

import { DateTime, Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { PlainType } from '@potentiel-domain/core';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading5 } from '@/components/atoms/headings';
import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';

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
    <DétailsChangement
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
      statut="information-enregistrée"
    />
  ) : (
    <div className="flex flex-col gap-4">
      <DétailsChangement
        title="Demande de changement de puissance"
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
        statut={demande.statut.statut}
      />
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
    </div>
  );
};

type DétailsPuissanceProps = {
  unitéPuissance: DétailsChangementPuissanceProps['unitéPuissance'];
  puissanceInitiale: DétailsChangementPuissanceProps['puissanceInitiale'];
  nouvellePuissance: DétailsPuissancePageProps['demande']['nouvellePuissance'];
};

const DétailsPuissance = ({
  unitéPuissance,
  puissanceInitiale,
  nouvellePuissance,
}: DétailsPuissanceProps) => (
  <>
    <div>
      <span className="font-medium">Puissance demandée</span> : {nouvellePuissance} {unitéPuissance}
    </div>
    <div>
      <span className="font-medium">Puissance initiale</span> : {puissanceInitiale} {unitéPuissance}
    </div>
  </>
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
