import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Icon } from '@/components/atoms/Icon';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { Etape, FormatFichierInvalide } from '../../components';

export type ÉtapePropositionTechniqueEtFinancièreProps = {
  identifiantProjet: string;
  référence: string;
  propositionTechniqueEtFinancière?: PlainType<
    Lauréat.Raccordement.ConsulterDossierRaccordementReadModel['propositionTechniqueEtFinancière']
  >;
  actions: { transmettre: boolean; modifier: boolean };
};

export const ÉtapePropositionTechniqueEtFinancière: FC<
  ÉtapePropositionTechniqueEtFinancièreProps
> = ({ identifiantProjet, référence, propositionTechniqueEtFinancière, actions }) => {
  const propositionTechniqueEtFinancièreSignée = propositionTechniqueEtFinancière
    ? DocumentProjet.bind(
        propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée,
      ).formatter()
    : undefined;

  const dateSignature = propositionTechniqueEtFinancière
    ? DateTime.bind(propositionTechniqueEtFinancière.dateSignature).formatter()
    : undefined;

  return (
    <Etape
      className="relative"
      titre="Proposition technique et financière"
      statut={
        dateSignature && propositionTechniqueEtFinancièreSignée ? 'étape validée' : 'étape à venir'
      }
    >
      {dateSignature && propositionTechniqueEtFinancièreSignée ? (
        <div className="flex flex-col text-sm gap-2">
          <div className="flex items-center">
            <Icon
              id="fr-icon-calendar-line"
              size="xs"
              className="mr-1"
              title="date de signature de la proposition technique et financière"
            />
            <FormattedDate date={dateSignature} />
          </div>

          {propositionTechniqueEtFinancièreSignée && (
            <div>
              {propositionTechniqueEtFinancièreSignée.endsWith('.bin') && <FormatFichierInvalide />}
              <DownloadDocument
                className="flex items-center"
                url={Routes.Document.télécharger(propositionTechniqueEtFinancièreSignée)}
                label="Télécharger la proposition technique et financière"
                format="pdf"
              />
            </div>
          )}

          {actions.modifier && (
            <Link
              href={Routes.Raccordement.modifierPropositionTechniqueEtFinancière(
                identifiantProjet,
                référence,
              )}
              className="absolute top-2 right-2"
              aria-label={`Modifier la proposition technique et financière pour le dossier ${référence}`}
            >
              <Icon id="fr-icon-pencil-fill" size="xs" className="mr-1" />
              Modifier
            </Link>
          )}
        </div>
      ) : actions.transmettre ? (
        <Link
          className="mt-4 w-fit mx-auto"
          href={Routes.Raccordement.transmettrePropositionTechniqueEtFinancière(
            identifiantProjet,
            référence,
          )}
          aria-label={`Transmettre la proposition technique et financière pour le dossier ${référence}`}
        >
          Transmettre
        </Link>
      ) : (
        <></>
      )}
    </Etape>
  );
};
