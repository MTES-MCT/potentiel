import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Abandon } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToAbandonDemandéTimelineProps = (
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

export const mapToAbandonAnnuléTimelineProps = (
  abandonAnnulé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { annuléLe, annuléPar } = abandonAnnulé.payload as Abandon.AbandonAnnuléEvent['payload'];

  return {
    date: annuléLe,
    title: <div>Abandon annulé par {<span className="font-semibold">{annuléPar}</span>}</div>,
  };
};

export const mapToConfirmationAbandonDemandéeTimelineProps = (
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
};

export const mapToAbandonConfirméTimelineProps = (
  abandonConfirmé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { confirméLe, confirméPar } =
    abandonConfirmé.payload as Abandon.AbandonConfirméEvent['payload'];

  return {
    date: confirméLe,
    title: <div>Abandon confirmé par {<span className="font-semibold">{confirméPar}</span>}</div>,
  };
};

export const mapToAbandonAccordéTimelineProps = (
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
  };
};

export const mapToAbandonRejetéTimelineProps = (
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
  };
};

export const mapToPreuveRecandidatureDemandéeTimelineProps = (
  preuveRecandidatureDemandée: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { demandéeLe } =
    preuveRecandidatureDemandée.payload as Abandon.PreuveRecandidatureDemandéeEvent['payload'];

  return {
    date: demandéeLe,
    title: <div>Preuve de recandidature demandée</div>,
  };
};

export const mapToPreuveRecandidatureTransmiseTimelineProps = (
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
