'use client';

import { FC } from 'react';
import { match } from 'ts-pattern';

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
        type: 'AbandonAccordé-V1',
      },
      (abandonAccordé) => {
        const {
          accordéLe,
          accordéPar,
          identifiantProjet,
          réponseSignée: { format },
        } = abandonAccordé.payload as Abandon.AbandonAccordéEvent['payload'];

        const réponseSignée = DocumentProjet.convertirEnValueType(
          identifiantProjet,
          '',
          accordéLe,
          format,
        ).formatter();

        return {
          status: 'success',
          date: accordéLe,
          title: (
            <div>Abandon accordé par {<span className="font-semibold">{accordéPar}</span>}</div>
          ),
          content: (
            <DownloadDocument
              className="mb-0"
              label="Télécharger la pièce justificative"
              format="pdf"
              url={Routes.Document.télécharger(réponseSignée)}
            />
          ),
        } satisfies TimelineProps['items'][number];
      },
    )
    .otherwise(() => ({
      status: 'success',
      date: DateTime.now().formatter(),
      title: (
        <div>
          Abandon accordé par {<span className="font-semibold">{DateTime.now().formatter()}</span>}
        </div>
      ),
    }));
};

// if (
//   recandidature?.preuve?.transmiseLe &&
//   recandidature?.preuve?.transmisePar &&
//   recandidature?.preuve?.identifiantProjet
// ) {
//   const identifiantProjetPreuve = IdentifiantProjet.bind(
//     recandidature.preuve.identifiantProjet,
//   ).formatter();
//   const transmiseLe = DateTime.bind(recandidature.preuve.transmiseLe).formatter();
//   const transmisePar = Email.bind(recandidature.preuve.transmisePar).formatter();
//   items.push({
//     status: 'success',
//     date: transmiseLe,
//     title: (
//       <div>
//         Le{' '}
//         <Link
//           href={Routes.Projet.details(identifiantProjetPreuve)}
//           aria-label={`voir le projet faisant office de preuve de recandidature`}
//         >
//           projet faisant preuve de recandidature
//         </Link>{' '}
//         a été transmis par {<span className="font-semibold">{transmisePar}</span>}
//       </div>
//     ),
//   });
// }

// if (accord) {
//   const accordéLe = DateTime.bind(accord.accordéLe).formatter();
//   const accordéPar = Email.bind(accord.accordéPar).formatter();
//   const réponseSignée = DocumentProjet.bind(accord.réponseSignée).formatter();

//   items.push({
//     status: 'success',
//     date: accordéLe,
//     title: <div>Abandon accordé par {<span className="font-semibold">{accordéPar}</span>}</div>,
//     content: (
//       <>
//         {accord.réponseSignée && (
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
// }

// if (rejet) {
//   const rejetéLe = DateTime.bind(rejet.rejetéLe).formatter();
//   const rejetéPar = Email.bind(rejet.rejetéPar).formatter();
//   const réponseSignée = DocumentProjet.bind(rejet.réponseSignée).formatter();

//   items.push({
//     status: 'error',
//     date: rejetéLe,
//     title: <div>Abandon rejeté par {<span className="font-semibold">{rejetéPar}</span>}</div>,
//     content: (
//       <>
//         {rejet.réponseSignée && (
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
// }

// if (confirmation?.confirméLe && confirmation?.confirméPar) {
//   const confirméLe = DateTime.bind(confirmation.confirméLe).formatter();
//   const confirméPar = Email.bind(confirmation.confirméPar).formatter();
//   items.push({
//     date: confirméLe,
//     title: (
//       <div>Demande confirmée par {<span className="font-semibold">{confirméPar}</span>}</div>
//     ),
//   });
// }

// if (confirmation) {
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
// }

// const abandonDemandéLe = DateTime.bind(demandéLe).formatter();
// const abandonDemandéPar = Email.bind(demandéPar).formatter();
// const abandonPièceJustificative = pièceJustificative
//   ? DocumentProjet.bind(pièceJustificative).formatter()
//   : undefined;
// items.push({
//   date: abandonDemandéLe,
//   title: (
//     <div>Demande déposée par {<span className="font-semibold">{abandonDemandéPar}</span>}</div>
//   ),
//   content: (
//     <>
//       {recandidature && (
//         <div className="mb-4">
//           Le projet s'inscrit dans un{' '}
//           <span className="font-semibold">contexte de recandidature</span>
//         </div>
//       )}
//       {abandonPièceJustificative && (
//         <DownloadDocument
//           className="mb-0"
//           label="Télécharger la pièce justificative"
//           format="pdf"
//           url={Routes.Document.télécharger(abandonPièceJustificative)}
//         />
//       )}
//     </>
//   ),
// });
