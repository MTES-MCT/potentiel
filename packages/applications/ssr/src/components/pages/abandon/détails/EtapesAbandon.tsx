'use client';

import { FC } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import { displayDate } from '@/utils/displayDate';
import Download from '@codegouvfr/react-dsfr/Download';
import { encodeParameter } from '@/utils/encodeParameter';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-libraries/routes';

export type EtapesAbandonProps = {
  demande: {
    demandéPar: string;
    demandéLe: string;
    recandidature: boolean;
    raison: string;
    pièceJustificative?: string;
    preuveRecandidature?: string;
  };
  confirmation?: {
    demandéLe: string;
    demandéPar: string;
    réponseSignée: string;
    confirméLe?: string;
    confirméPar?: string;
  };
  accord?: { accordéPar: string; accordéLe: string; réponseSignée: string };
  rejet?: { rejetéPar: string; rejetéLe: string; réponseSignée: string };
};

export const EtapesAbandon: FC<EtapesAbandonProps & { statut: string }> = ({
  statut,
  demande: {
    demandéLe,
    demandéPar,
    recandidature,
    raison,
    pièceJustificative: justificatifDemande,
    preuveRecandidature,
  },
  confirmation,
  accord,
  rejet,
}) => {
  return (
    <div className="flex flex-col">
      {recandidature && (
        <Alert
          className="mb-6"
          severity="warning"
          small
          description={
            <div>
              <div className="font-bold mb-2">Demande d'abandon pour recandidature</div>
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

      {recandidature && statut === 'accordé' && (
        <div>
          <p className="font-bold mb-4">
            {preuveRecandidature ? (
              <span>
                Le porteur a bien transmis un{' '}
                <a
                  href={`/projet/${encodeParameter(preuveRecandidature)}/details.html`}
                  aria-label={`voir le projet faisant office de preuve de recandidature`}
                >
                  projet comme preuve de recandidature
                </a>
                .
              </span>
            ) : (
              <span>
                Le porteur n'a pas encore transmis de projet comme preuve de recandidature.
              </span>
            )}
          </p>
        </div>
      )}

      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.2,
            paddingLeft: 0,
          },
          paddingLeft: 0,
        }}
      >
        {accord && (
          <TimelineItem>
            <TimelineOppositeContent>
              {displayDate(new Date(accord.accordéLe))}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="success" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <div>
                <div>
                  Abandon accordé par {<span className="font-bold">{accord.accordéPar}</span>}
                </div>
                {accord.réponseSignée && (
                  <Download
                    details=""
                    label="Télécharger la pièce justificative"
                    linkProps={{
                      href: Routes.Document.télécharger(accord.réponseSignée),
                    }}
                    className="mb-0 pb-0"
                  />
                )}
              </div>
            </TimelineContent>
          </TimelineItem>
        )}

        {rejet && (
          <TimelineItem>
            <TimelineOppositeContent>
              {displayDate(new Date(rejet.rejetéLe))}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="error" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <div>
                <div>Abandon rejeté par {<span className="font-bold">{rejet.rejetéPar}</span>}</div>
                {rejet.réponseSignée && (
                  <Download
                    details=""
                    label="Télécharger la pièce justificative"
                    linkProps={{
                      href: Routes.Document.télécharger(rejet.réponseSignée),
                    }}
                    className="mb-0 pb-0"
                  />
                )}
              </div>
            </TimelineContent>
          </TimelineItem>
        )}

        {confirmation?.confirméLe && (
          <TimelineItem>
            <TimelineOppositeContent>
              {displayDate(new Date(confirmation.confirméLe))}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <div>
                Demande confirmée par{' '}
                {<span className="font-bold">{confirmation.confirméPar}</span>}
              </div>
            </TimelineContent>
          </TimelineItem>
        )}

        {confirmation && (
          <TimelineItem>
            <TimelineOppositeContent>
              {displayDate(new Date(confirmation.demandéLe))}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <div>
                <div>
                  Confirmation demandée par{' '}
                  {<span className="font-bold">{confirmation.demandéPar}</span>}
                </div>
                {confirmation.réponseSignée && (
                  <Download
                    details=""
                    label="Télécharger la pièce justificative"
                    linkProps={{
                      href: Routes.Document.télécharger(confirmation.réponseSignée),
                    }}
                    className="mb-0 pb-0"
                  />
                )}
              </div>
            </TimelineContent>
          </TimelineItem>
        )}

        <TimelineItem>
          <TimelineOppositeContent>{displayDate(new Date(demandéLe))}</TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>
            <div>
              <div>Demande déposée par {<span className="font-bold">{demandéPar}</span>}</div>
              {recandidature && (
                <div>
                  Le projet s'inscrit dans un{' '}
                  <span className="font-bold">contexte de recandidature</span>
                </div>
              )}
              <div>
                Explications du porteur de projet :
                <blockquote className="italic">
                  <p className="mt-2">"{raison}"</p>
                </blockquote>
              </div>
              {justificatifDemande && (
                <Download
                  details=""
                  label="Télécharger la pièce justificative"
                  linkProps={{
                    href: Routes.Document.télécharger(justificatifDemande),
                  }}
                  className="mb-0 pb-0"
                />
              )}
            </div>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
};
