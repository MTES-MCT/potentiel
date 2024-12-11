'use client';

import { FC } from 'react';
import { match } from 'ts-pattern';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Abandon } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Timeline, TimelineProps } from '@/components/organisms/Timeline';

export type HistoriqueListProps = {
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel>;
};

export const HistoriqueList: FC<HistoriqueListProps> = ({ historique }) => {
  return <Timeline items={historique.items.map((item) => mapToTimelineProps(item))} />;
};

const mapToTimelineProps = (
  record: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  return match(record)
    .returnType<TimelineProps['items'][number]>()
    .with(
      {
        type: 'AbandonDemandé-V1',
      },
      mapToAbandonDemandéTimelineProps,
    )
    .with(
      {
        type: 'AbandonAnnulé-V1',
      },
      mapToAbandonAnnuléTimelineProps,
    )
    .with(
      {
        type: 'ConfirmationAbandonDemandée-V1',
      },
      mapToConfirmationAbandonDemandéeTimelineProps,
    )
    .with(
      {
        type: 'AbandonConfirmé-V1',
      },
      mapToAbandonConfirméTimelineProps,
    )
    .with(
      {
        type: 'AbandonAccordé-V1',
      },
      mapToAbandonAccordéTimelineProps,
    )
    .with(
      {
        type: 'AbandonRejeté-V1',
      },
      mapToAbandonRejetéTimelineProps,
    )
    .with(
      {
        type: 'PreuveRecandidatureDemandée-V1',
      },
      mapToPreuveRecandidatureDemandéeTimelineProps,
    )
    .with(
      {
        type: 'PreuveRecandidatureTransmise-V1',
      },
      mapToPreuveRecandidatureTransmiseTimelineProps,
    )
    .otherwise(() => ({
      date: DateTime.now().formatter(),
      title: (
        <div>
          Abandon accordé par {<span className="font-semibold">{DateTime.now().formatter()}</span>}
        </div>
      ),
    }));
};

const mapToAbandonDemandéTimelineProps = (
  abandonDemandé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { demandéLe, demandéPar, identifiantProjet, recandidature, pièceJustificative } =
    abandonDemandé.payload as Abandon.AbandonDemandéEvent['payload'];

  return {
    date: demandéLe,
    title: <div>Demande déposée par {<span className="font-semibold">{demandéPar}</span>}</div>,
    content: (
      <>
        {recandidature && (
          <div className="mb-4">
            Le projet s'inscrit dans un{' '}
            <span className="font-semibold">contexte de recandidature</span>
          </div>
        )}
        {pièceJustificative && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format="pdf"
            url={Routes.Document.télécharger(
              DocumentProjet.convertirEnValueType(
                identifiantProjet,
                Abandon.TypeDocumentAbandon.pièceJustificative.formatter(),
                demandéLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
      </>
    ),
  };
};

const mapToAbandonAnnuléTimelineProps = (
  abandonAnnulé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { annuléLe, annuléPar } = abandonAnnulé.payload as Abandon.AbandonAnnuléEvent['payload'];

  return {
    date: annuléLe,
    title: <div>Abandon annulé par {<span className="font-semibold">{annuléPar}</span>}</div>,
  };
};

const mapToConfirmationAbandonDemandéeTimelineProps = (
  confirmationAbandonDemandée: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    confirmationDemandéeLe,
    confirmationDemandéePar,
    identifiantProjet,
    réponseSignée: { format },
  } = confirmationAbandonDemandée.payload as Abandon.ConfirmationAbandonDemandéeEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Abandon.TypeDocumentAbandon.abandonÀConfirmer.formatter(),
    confirmationDemandéeLe,
    format,
  ).formatter();

  return {
    date: confirmationDemandéeLe,
    title: (
      <div>
        Confirmation demandée par {<span className="font-semibold">{confirmationDemandéePar}</span>}
      </div>
    ),
    content: (
      <>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format="pdf"
          url={Routes.Document.télécharger(réponseSignée)}
        />
      </>
    ),
  };
  //   const demandéeLe = DateTime.bind(confirmation.demandéeLe).formatter();
  //   const demandéePar = Email.bind(confirmation.demandéePar).formatter();
  //   const réponseSignée = DocumentProjet.bind(confirmation.réponseSignée).formatter();
  //   items.push({
  //     date: demandéeLe,
  //     title: (
  //       <div>Confirmation demandée par {<span className="font-semibold">{demandéePar}</span>}</div>
  //     ),
  //     content: (
  //       <>
  //         {confirmation.réponseSignée && (
  //           <DownloadDocument
  //             className="mb-0"
  //             label="Télécharger la pièce justificative"
  //             format="pdf"
  //             url={Routes.Document.télécharger(réponseSignée)}
  //           />
  //         )}
  //       </>
  //     ),
  //   });
};

const mapToAbandonConfirméTimelineProps = (
  abandonConfirmé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { confirméLe, confirméPar } =
    abandonConfirmé.payload as Abandon.AbandonConfirméEvent['payload'];

  return {
    date: confirméLe,
    title: <div>Abandon confirmé par {<span className="font-semibold">{confirméPar}</span>}</div>,
  };
};

const mapToAbandonAccordéTimelineProps = (
  abandonAccordé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = abandonAccordé.payload as Abandon.AbandonAccordéEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Abandon.TypeDocumentAbandon.abandonAccordé.formatter(),
    accordéLe,
    format,
  ).formatter();

  return {
    date: accordéLe,
    title: <div>Abandon accordé par {<span className="font-semibold">{accordéPar}</span>}</div>,
    content: (
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format="pdf"
        url={Routes.Document.télécharger(réponseSignée)}
      />
    ),
  } satisfies TimelineProps['items'][number];
};

const mapToAbandonRejetéTimelineProps = (
  abandonAnnulé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    rejetéLe,
    rejetéPar,
    réponseSignée: { format },
    identifiantProjet,
  } = abandonAnnulé.payload as Abandon.AbandonRejetéEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Abandon.TypeDocumentAbandon.abandonRejeté.formatter(),
    rejetéLe,
    format,
  ).formatter();

  return {
    date: rejetéLe,
    title: <div>Abandon rejeté par {<span className="font-semibold">{rejetéPar}</span>}</div>,
    content: (
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format="pdf"
        url={Routes.Document.télécharger(réponseSignée)}
      />
    ),
  } satisfies TimelineProps['items'][number];
};

const mapToPreuveRecandidatureDemandéeTimelineProps = (
  preuveRecandidatureDemandée: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { demandéeLe } =
    preuveRecandidatureDemandée.payload as Abandon.PreuveRecandidatureDemandéeEvent['payload'];

  return {
    date: demandéeLe,
    title: <div>Preuve de recandidature demandée</div>,
  };
};

const mapToPreuveRecandidatureTransmiseTimelineProps = (
  preuveRecandidatureTransmise: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { preuveRecandidature, transmiseLe, transmisePar } =
    preuveRecandidatureTransmise.payload as Abandon.PreuveRecandidatureTransmiseEvent['payload'];

  return {
    date: transmiseLe,
    title: (
      <div>
        Le{' '}
        <Link
          href={Routes.Projet.details(preuveRecandidature)}
          aria-label={`voir le projet faisant office de preuve de recandidature`}
        >
          projet faisant preuve de recandidature
        </Link>{' '}
        a été transmis par {<span className="font-semibold">{transmisePar}</span>}
      </div>
    ),
  };
};
