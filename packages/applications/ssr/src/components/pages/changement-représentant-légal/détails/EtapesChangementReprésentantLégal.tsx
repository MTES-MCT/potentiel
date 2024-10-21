'use client';

import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
// import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';
import { Timeline, TimelineProps } from '@/components/organisms/Timeline';

export type EtapesChangementReprésentantLégalProps = {
  // changementReprésentantLégal: PlainType<ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel>;
  changementReprésentantLégal: PlainType<{
    identifiantProjet: IdentifiantProjet.ValueType;
    statut: 'accordé' | 'annulé' | 'demandé' | 'rejeté';
    demande: {
      nomReprésentantLégal: string;
      pièceJustificative: DocumentProjet.ValueType;
      demandéLe: DateTime.ValueType;
      demandéPar: Email.ValueType;
      accord?: {
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
    demande: { demandéLe, demandéPar, nomReprésentantLégal, accord, pièceJustificative, rejet },
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
        <div>Nom du représentant légal : {nomReprésentantLégal}</div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format="pdf"
          url={Routes.Document.télécharger(DocumentProjet.bind(pièceJustificative).formatter())}
        />
      </>
    ),
  });

  return <Timeline items={items} />;
};
