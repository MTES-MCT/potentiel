import Download from '@codegouvfr/react-dsfr/Download';
import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, formatDate } from '@potentiel-libraries/iso8601-datetime';

import { Icon } from '@/components/atoms/Icon';

import { FormatFichierInvalide } from './FormatFichierInvalide';
import { Etape } from './Étape';

type ÉtapePropositionTechniqueEtFinancièreProps = {
  identifiantProjet: string;
  référence: string;
  dateSignature?: Iso8601DateTime;
  propositionTechniqueEtFinancièreSignée?: string;
  canEdit: boolean;
};

export const ÉtapePropositionTechniqueEtFinancière: FC<
  ÉtapePropositionTechniqueEtFinancièreProps
> = ({
  identifiantProjet,
  référence,
  dateSignature,
  propositionTechniqueEtFinancièreSignée,
  canEdit,
}) => (
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
          {formatDate(dateSignature)}
        </div>

        {propositionTechniqueEtFinancièreSignée && (
          <div>
            {propositionTechniqueEtFinancièreSignée.endsWith('.bin') && <FormatFichierInvalide />}
            <Download
              className="flex items-center"
              linkProps={{
                href: Routes.Document.télécharger(propositionTechniqueEtFinancièreSignée),
                'aria-label': `Télécharger la proposition technique et financière pour le dossier ${référence}`,
                title: `Télécharger la proposition technique et financière pour le dossier ${référence}`,
              }}
              label="Télécharger la pièce justificative"
              details=""
            />
          </div>
        )}

        {canEdit && (
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
    ) : (
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
    )}
  </Etape>
);
