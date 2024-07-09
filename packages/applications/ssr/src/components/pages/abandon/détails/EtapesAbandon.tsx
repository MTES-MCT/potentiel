'use client';

import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { Timeline, TimelineProps } from '@/components/organisms/Timeline';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';

import { StatutPreuveRecandidatureBadgeProps } from './PreuveRecandidatureStatutBadge';

export type EtapesAbandonProps = {
  demande: {
    demandéPar: string;
    demandéLe: Iso8601DateTime;
    lienRecandidature?: string;
    recandidature: boolean;
    preuveRecandidatureStatut: StatutPreuveRecandidatureBadgeProps['statut'];
    preuveRecandidature?: string;
    preuveRecandidatureTransmiseLe?: Iso8601DateTime;
    preuveRecandidatureTransmisePar?: string;
    raison: string;
    pièceJustificative?: string;
  };
  confirmation?: {
    demandéLe: Iso8601DateTime;
    demandéPar: string;
    réponseSignée: string;
    confirméLe?: Iso8601DateTime;
    confirméPar?: string;
  };
  accord?: { accordéPar: string; accordéLe: Iso8601DateTime; réponseSignée: string };
  rejet?: { rejetéPar: string; rejetéLe: Iso8601DateTime; réponseSignée: string };
};

export const EtapesAbandon: FC<EtapesAbandonProps> = ({
  demande: {
    demandéLe,
    demandéPar,
    lienRecandidature,
    recandidature,
    raison,
    pièceJustificative: justificatifDemande,
    preuveRecandidatureStatut,
    preuveRecandidature,
    preuveRecandidatureTransmiseLe,
    preuveRecandidatureTransmisePar,
  },
  confirmation,
  accord,
  rejet,
}) => {
  const items: TimelineProps['items'] = [];

  if (preuveRecandidatureStatut === 'en-attente' && accord) {
    items.push({
      status: 'warning',
      date: 'En attente',
      title: lienRecandidature ? (
        <Link href={lienRecandidature}>Transmettre un projet comme preuve de recandidature</Link>
      ) : (
        "Le porteur n'a pas encore transmis de projet comme preuve de recandidature."
      ),
    });
  }

  if (preuveRecandidature && preuveRecandidatureTransmiseLe && preuveRecandidatureTransmisePar) {
    items.push({
      status: 'success',
      date: preuveRecandidatureTransmiseLe,
      title: (
        <div>
          Le{' '}
          <Link
            href={Routes.Projet.details(preuveRecandidature)}
            aria-label={`voir le projet faisant office de preuve de recandidature`}
          >
            projet faisant preuve de recandidature
          </Link>{' '}
          a été transmis par{' '}
          {<span className="font-semibold">{preuveRecandidatureTransmisePar}</span>}
        </div>
      ),
    });
  }

  if (accord) {
    items.push({
      status: 'success',
      date: accord.accordéLe,
      title: (
        <div>Abandon accordé par {<span className="font-semibold">{accord.accordéPar}</span>}</div>
      ),
      content: (
        <>
          {accord.réponseSignée && (
            <DownloadDocument
              className="mb-0"
              label="Télécharger la pièce justificative"
              format="pdf"
              url={Routes.Document.télécharger(accord.réponseSignée)}
            />
          )}
        </>
      ),
    });
  }

  if (rejet) {
    items.push({
      status: 'error',
      date: rejet.rejetéLe,
      title: (
        <div>Abandon rejeté par {<span className="font-semibold">{rejet.rejetéPar}</span>}</div>
      ),
      content: (
        <>
          {rejet.réponseSignée && (
            <DownloadDocument
              className="mb-0"
              label="Télécharger la pièce justificative"
              format="pdf"
              url={Routes.Document.télécharger(rejet.réponseSignée)}
            />
          )}
        </>
      ),
    });
  }

  if (confirmation?.confirméLe) {
    items.push({
      date: confirmation.confirméLe,
      title: (
        <div>
          Demande confirmée par {<span className="font-semibold">{confirmation.confirméPar}</span>}
        </div>
      ),
    });
  }

  if (confirmation) {
    items.push({
      date: confirmation.demandéLe,
      title: (
        <div>
          Confirmation demandée par{' '}
          {<span className="font-semibold">{confirmation.demandéPar}</span>}
        </div>
      ),
      content: (
        <>
          {confirmation.réponseSignée && (
            <DownloadDocument
              className="mb-0"
              label="Télécharger la pièce justificative"
              format="pdf"
              url={Routes.Document.télécharger(confirmation.réponseSignée)}
            />
          )}
        </>
      ),
    });
  }

  items.push({
    date: demandéLe,
    title: <div>Demande déposée par {<span className="font-semibold">{demandéPar}</span>}</div>,
    content: (
      <>
        {recandidature && (
          <div>
            Le projet s'inscrit dans un{' '}
            <span className="font-semibold">contexte de recandidature</span>
          </div>
        )}
        <div>
          Explications du porteur de projet :
          <blockquote className="italic">
            <p className="mt-2">"{raison}"</p>
          </blockquote>
        </div>
        {justificatifDemande && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format="pdf"
            url={Routes.Document.télécharger(justificatifDemande)}
          />
        )}
      </>
    ),
  });

  return (
    <div className="flex flex-col">
      {recandidature && (
        <Alert
          className="mb-6"
          severity="warning"
          small
          description={
            <div>
              <div className="font-semibold mb-2">Demande d'abandon pour recandidature</div>
              Le porteur s'engage sur l'honneur à ne pas avoir débuté ses travaux au sens du cahier
              des charges de l'AO associé et a abandonné son statut de lauréat au profit d'une
              recandidature réalisée au plus tard le 31/12/2024. <br />
              Il s'engage sur l'honneur à ce que cette recandidature respecte les conditions
              suivantes :
              <ul className="mb-0 list-disc indent-8 list-inside">
                <li>
                  Que le dossier soit complet et respecte les conditions d'éligibilité du cahier des
                  charges concerné
                </li>
                <li>Le même lieu d'implantation que le projet abandonné</li>
                <li>
                  La même autorisation préfectorale (numéro ICPE identifique) que le projet
                  abandonné, nonobstant des porter à connaissance ultérieurs
                </li>
                <li>
                  Le tarif proposé ne doit pas être supérieur au prix plafond de la période dont le
                  projet était initialement lauréat, indexé jusqu’à septembre 2023 selon la formule
                  d’indexation du prix de référence indiquée dans le cahier des charges concerné par
                  la recandidature.
                </li>
              </ul>
            </div>
          }
        />
      )}
      <Timeline items={items} />
    </div>
  );
};
