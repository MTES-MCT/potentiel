import React, { FC } from 'react';
import routes from '@routes';
import { TagIcon, CalendarIcon, DownloadLink, EditIcon, Link } from '@components';
import { afficherDate } from '@views/helpers';
import { Etape } from './Etape';

type ÉtapeDemandeComplèteRaccordementProps = {
  identifiantProjet: string;
  dateQualification: string | undefined;
  référence: string;
  hasDCRFile: boolean;
  showEditLink: boolean;
};

export const ÉtapeDemandeComplèteRaccordement: FC<ÉtapeDemandeComplèteRaccordementProps> = ({
  identifiantProjet,
  dateQualification,
  référence,
  hasDCRFile,
  showEditLink,
}) => (
  <Etape
    className="relative"
    statut={dateQualification ? 'étape validée' : 'étape incomplète'}
    titre="Demande complète de raccordement"
  >
    <div className="flex flex-col text-sm gap-2">
      <div className="flex items-center">
        <TagIcon className="mr-1" title="référence du dossier de raccordement" />
        <span className="font-bold">{référence}</span>
      </div>

      <div className="flex items-center">
        <CalendarIcon className="mr-1" title="date de l'accusé de réception" />
        {dateQualification ? (
          afficherDate(new Date(dateQualification))
        ) : showEditLink ? (
          <Link
            href={routes.GET_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(
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

      {hasDCRFile && (
        <DownloadLink
          className="flex items-center"
          fileUrl={routes.GET_DEMANDE_COMPLETE_RACCORDEMENT_FILE(identifiantProjet, référence)}
        >
          Télécharger l'accusé de réception
        </DownloadLink>
      )}

      {showEditLink && (
        <Link
          href={routes.GET_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(
            identifiantProjet,
            référence,
          )}
          className="absolute top-2 right-2"
        >
          <EditIcon aria-hidden className="mr-1" />
          Modifier
        </Link>
      )}
    </div>
  </Etape>
);
