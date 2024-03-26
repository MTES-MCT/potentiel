import Download from '@codegouvfr/react-dsfr/Download';
import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-libraries/routes';

import { displayDate } from '@/utils/displayDate';
import { WarningIcon } from '@/components/atoms/icons';
import { Icon } from '@/components/atoms/Icon';

import { Etape } from './Étape';

type ÉtapeDemandeComplèteRaccordementProps = {
  identifiantProjet: string;
  référence: string;
  dateQualification?: string;
  accuséRéception?: string;
  canEdit: boolean;
};

export const ÉtapeDemandeComplèteRaccordement: FC<ÉtapeDemandeComplèteRaccordementProps> = ({
  identifiantProjet,
  référence,
  dateQualification,
  accuséRéception,
  canEdit,
}) => (
  <Etape
    className="relative"
    statut={dateQualification ? 'étape validée' : 'étape incomplète'}
    titre="Demande complète de raccordement"
  >
    <div className="flex flex-col text-sm gap-2">
      <div className="flex items-center">
        <Icon id="fr-icon-information-line" size="sm" className="mr-1" />
        <span className="font-bold">{référence}</span>
      </div>

      <div className="flex items-center">
        <Icon
          id="fr-icon-calendar-line"
          size="xs"
          className="mr-1"
          title="date de l'accusé de réception"
        />
        {dateQualification ? (
          displayDate(new Date(dateQualification))
        ) : canEdit ? (
          <Link
            href={Routes.Raccordement.modifierDemandeComplèteRaccordement(
              identifiantProjet,
              référence,
            )}
          >
            Date de l'accusé de réception à renseigner
          </Link>
        ) : (
          <p className="font-bold">Date de l'accusé de réception manquante</p>
        )}
      </div>

      {accuséRéception && (
        <div>
          {accuséRéception.endsWith('.bin') && (
            <WarningIcon
              className="w-8 h-8 md:mx-auto text-warning-425-base"
              title="format du fichier invalide"
            />
          )}
          <Download
            className="flex items-center"
            linkProps={{
              href: Routes.Document.télécharger(accuséRéception),
              'aria-label': `Télécharger l'accusé de réception pour le dossier ${référence}`,
              title: `Télécharger l'accusé de réception pour le dossier ${référence}`,
            }}
            label="Télécharger la pièce justificative"
            details=""
          />
        </div>
      )}

      {canEdit && (
        <Link
          href={Routes.Raccordement.modifierDemandeComplèteRaccordement(
            identifiantProjet,
            référence,
          )}
          className="absolute top-2 right-2"
          aria-label={`Modifier la demande de raccordement ${référence}`}
        >
          <Icon id="fr-icon-pencil-fill" size="xs" className="mr-1" />
          Modifier
        </Link>
      )}
    </div>
  </Etape>
);
