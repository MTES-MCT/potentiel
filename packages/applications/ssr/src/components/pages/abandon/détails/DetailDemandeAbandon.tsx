'use client';

import Alert from '@codegouvfr/react-dsfr/Alert';
import { CallOut } from '@codegouvfr/react-dsfr/CallOut';
import Download from '@codegouvfr/react-dsfr/Download';
import { FC } from 'react';

import { Heading2 } from '@/components/atoms/headings';
import { displayDate } from '@/utils/displayDate';
import { encodeParameter } from '@/utils/encodeParameter';

export type DetailDemandeAbandonProps = {
  demandéPar: string;
  demandéLe: string;
  recandidature: boolean;
  raison: string;
  pièceJustificative?: string;
  preuveRecandidature?: string;
};

export const DetailDemandeAbandon: FC<DetailDemandeAbandonProps & { statut: string }> = ({
  demandéPar,
  demandéLe,
  recandidature,
  raison,
  pièceJustificative,
  preuveRecandidature,
  statut,
}) => (
  <div className="mb-7">
    <CallOut>
      <span className="text-base">
        Demande déposée par <span className="font-bold">{demandéPar}</span> le{' '}
        <span className="font-bold">{displayDate(new Date(demandéLe))}</span>
        {recandidature && (
          <>
            <br />
            Le projet s'inscrit dans un <span className="font-bold">contexte de recandidature</span>
          </>
        )}
        <br />
        Explications du porteur de projet : <span className="italic">"{raison}"</span>
        <br />
        {pièceJustificative && (
          <Download
            details=""
            label="Télécharger la pièce justificative"
            linkProps={{
              href: `/documents/${encodeParameter(pièceJustificative)}`,
            }}
            className="mb-0 pb-0"
          />
        )}
      </span>
    </CallOut>

    {recandidature && statut === 'accordé' && (
      <>
        <Heading2 className="mb-2">Preuve de recandidature</Heading2>
        {preuveRecandidature ? (
          <p>
            Le porteur a bien transmis un{' '}
            <a
              href={`/projet/${encodeParameter(preuveRecandidature)}/details.html`}
              aria-label={`voir le projet faisant office de preuve de recandidature`}
            >
              projet comme preuve de recandidature
            </a>
            .
          </p>
        ) : (
          <p>Le porteur n'a pas encore transmis de projet comme preuve de recandidature.</p>
        )}
      </>
    )}

    {recandidature && (
      <Alert
        className="my-4"
        severity="warning"
        title="Demande d'abandon pour recandidature"
        description={
          <div>
            Le porteur s'engage sur l'honneur à ne pas avoir débuté ses travaux au sens du cahier
            des charges de l'AO associé et a abandonné son statut de lauréat au profit d'une
            recandidature réalisée au plus tard le 31/12/2024. <br />
            Il s'engage sur l'honneur à ce que cette recandidature respecte les conditions suivantes
            :
            <ul className="mb-0 list-disc indent-8 list-inside">
              <li>
                Que le dossier soit complet et respecte les conditions d'éligibilité du cahier des
                charges concerné
              </li>
              <li>Le même lieu d'implantation que le projet abandonné</li>
              <li>
                La même autorisation préfectorale (numéro ICPE identifique) que le projet abandonné,
                nonobstant des porter à connaissance ultérieurs
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
  </div>
);
