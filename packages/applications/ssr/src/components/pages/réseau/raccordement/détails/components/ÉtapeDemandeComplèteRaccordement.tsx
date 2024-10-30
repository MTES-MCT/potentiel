import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { Icon } from '@/components/atoms/Icon';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { FormatFichierInvalide } from './FormatFichierInvalide';
import { Etape } from './Étape';

type ÉtapeDemandeComplèteRaccordementProps = {
  identifiantProjet: string;
  référence: string;
  dateQualification?: Iso8601DateTime;
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
          <FormattedDate date={dateQualification} />
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
          {accuséRéception.endsWith('.bin') && <FormatFichierInvalide />}
          <DownloadDocument
            className="flex items-center"
            url={Routes.Document.télécharger(accuséRéception)}
            label="Télécharger l'accusé de réception"
            format="pdf"
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
