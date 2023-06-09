import React, { FC } from 'react';

import routes from '@routes';
import { DossierRaccordementReadModel } from '@potentiel/domain-views';
import { CalendarIcon, DownloadLink, EditIcon, Link } from '@components';
import { afficherDate } from '@views/helpers';

import { Etape } from './Etape';

type ÉtapePropositionTechniqueEtFinancièreProps = {
  identifiantProjet: string;
  référence: string;
  propositionTechniqueEtFinancière: DossierRaccordementReadModel['propositionTechniqueEtFinancière'];
  hasPTFFile: boolean;
  showEditLink: boolean;
};

export const ÉtapePropositionTechniqueEtFinancière: FC<
  ÉtapePropositionTechniqueEtFinancièreProps
> = ({
  identifiantProjet,
  référence,
  propositionTechniqueEtFinancière,
  hasPTFFile,
  showEditLink,
}) => (
  <Etape
    className="relative"
    titre="Proposition technique et financière"
    statut={propositionTechniqueEtFinancière ? 'étape validée' : 'étape à venir'}
  >
    {propositionTechniqueEtFinancière ? (
      <div className="flex flex-col text-sm gap-2">
        <div className="flex items-center">
          <CalendarIcon
            className="mr-1"
            title="date de signature de la proposition technique et financière"
          />
          {afficherDate(new Date(propositionTechniqueEtFinancière.dateSignature))}
        </div>
        {hasPTFFile && (
          <div>
            <DownloadLink
              className="flex items-center"
              fileUrl={routes.GET_PROPOSITION_TECHNIQUE_ET_FINANCIERE_FILE(
                identifiantProjet,
                référence,
              )}
            >
              Télécharger
            </DownloadLink>
          </div>
        )}
        {showEditLink && (
          <Link
            href={routes.GET_MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIERE_PAGE(
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
    ) : (
      <Link
        className="mt-4 text-center"
        href={routes.GET_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE_PAGE(
          identifiantProjet,
          référence,
        )}
      >
        Transmettre
      </Link>
    )}
  </Etape>
);
