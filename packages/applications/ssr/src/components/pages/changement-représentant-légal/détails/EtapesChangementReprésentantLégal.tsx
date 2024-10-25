'use client';

import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
// import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Timeline, TimelineProps } from '@/components/organisms/Timeline';

export type EtapesChangementReprésentantLégalProps = {
  // changementReprésentantLégal: PlainType<ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel>;
  changementReprésentantLégal: PlainType<{
    identifiantProjet: IdentifiantProjet.ValueType;
    statut: 'accordé' | 'annulé' | 'demandé' | 'rejeté';
    demande: {
      typePersonne: string;
      nomReprésentantLégal: string;
      piècesJustificatives: Array<DocumentProjet.ValueType>;
      demandéLe: DateTime.ValueType;
      demandéPar: Email.ValueType;
      accord?: {
        typePersonne: string;
        nomReprésentantLégal: string;
        accordéLe: DateTime.ValueType;
        accordéPar: Email.ValueType;
      };
      rejet?: {
        rejetéLe: DateTime.ValueType;
        rejetéPar: Email.ValueType;
      };
    };
  }>;
  role: PlainType<Role.ValueType>;
};

export const EtapesChangementReprésentantLégal: FC<EtapesChangementReprésentantLégalProps> = ({
  changementReprésentantLégal: {
    demande: {
      demandéLe,
      demandéPar,
      typePersonne,
      nomReprésentantLégal,
      piècesJustificatives,
      accord,
      rejet,
    },
  },
}) => {
  const items: TimelineProps['items'] = [];

  if (accord) {
    const accordéLe = DateTime.bind(accord.accordéLe).formatter();
    const accordéPar = Email.bind(accord.accordéPar).formatter();

    items.push({
      status: 'success',
      date: accordéLe,
      title: (
        <div>Changement accordé par {<span className="font-semibold">{accordéPar}</span>}</div>
      ),
      content: (
        <>
          <div>Type de personne : {typePersonne}</div>
          <div>Nom du représentant légal : {nomReprésentantLégal}</div>
        </>
      ),
    });
  }

  if (rejet) {
    const rejetéLe = DateTime.bind(rejet.rejetéLe).formatter();
    const rejetéPar = Email.bind(rejet.rejetéPar).formatter();

    items.push({
      status: 'error',
      date: rejetéLe,
      title: <div>Changement rejeté par {<span className="font-semibold">{rejetéPar}</span>}</div>,
    });
  }

  items.push({
    date: DateTime.bind(demandéLe).formatter(),
    title: (
      <div>
        Changement demandé par{' '}
        {<span className="font-semibold">{Email.bind(demandéPar).formatter()}</span>}
      </div>
    ),
    content: (
      <>
        <div>Type de personne : {typePersonne}</div>
        <div>Nom du représentant légal : {nomReprésentantLégal}</div>
        {piècesJustificatives.map((pièceJustificative, index) => (
          <blockquote className="font-semibold italic" key={`piece-justificative-${index}`}>
            <DownloadDocument
              className="mb-0"
              label="Télécharger la pièce justificative"
              format={pièceJustificative.format}
              url={Routes.Document.télécharger(DocumentProjet.bind(pièceJustificative).formatter())}
            />
          </blockquote>
        ))}
      </>
    ),
  });

  return <Timeline items={items} />;
};
