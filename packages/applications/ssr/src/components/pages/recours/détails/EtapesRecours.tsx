'use client';

import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Recours } from '@potentiel-domain/elimine';

import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';
import { Timeline, TimelineProps } from '@/components/organisms/Timeline';

export type EtapesRecoursProps = {
  recours: PlainType<Recours.ConsulterRecoursReadModel>;
};

export const EtapesRecours: FC<EtapesRecoursProps> = ({
  recours: {
    demande: { demandéLe, demandéPar, accord, pièceJustificative, rejet },
  },
}) => {
  const items: TimelineProps['items'] = [];

  if (accord) {
    const accordéLe = DateTime.bind(accord.accordéLe).formatter();
    const accordéPar = Email.bind(accord.accordéPar).formatter();
    const réponseSignée = DocumentProjet.bind(accord.réponseSignée).formatter();

    items.push({
      status: 'success',
      date: accordéLe,
      title: <div>Recours accordé par {<span className="font-semibold">{accordéPar}</span>}</div>,
      content: (
        <>
          {accord.réponseSignée && (
            <DownloadDocument
              className="mb-0"
              label="Télécharger la réponse signée"
              format="pdf"
              url={Routes.Document.télécharger(réponseSignée)}
            />
          )}
        </>
      ),
    });
  }

  if (rejet) {
    const rejetéLe = DateTime.bind(rejet.rejetéLe).formatter();
    const rejetéPar = Email.bind(rejet.rejetéPar).formatter();
    const réponseSignée = DocumentProjet.bind(rejet.réponseSignée).formatter();

    items.push({
      status: 'error',
      date: rejetéLe,
      title: <div>Recours rejeté par {<span className="font-semibold">{rejetéPar}</span>}</div>,
      content: (
        <>
          {rejet.réponseSignée && (
            <DownloadDocument
              className="mb-0"
              label="Télécharger la réponse signée"
              format="pdf"
              url={Routes.Document.télécharger(réponseSignée)}
            />
          )}
        </>
      ),
    });
  }

  items.push({
    date: DateTime.bind(demandéLe).formatter(),
    title: (
      <div>
        Demande déposée par{' '}
        {<span className="font-semibold">{Email.bind(demandéPar).formatter()}</span>}
      </div>
    ),
    content: (
      <DownloadDocument
        className="mb-0"
        label="Télécharger la pièce justificative"
        format="pdf"
        url={Routes.Document.télécharger(DocumentProjet.bind(pièceJustificative).formatter())}
      />
    ),
  });

  return <Timeline items={items} />;
};
