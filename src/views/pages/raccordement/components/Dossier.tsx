import React, { FC } from 'react';
import { userIs } from '@modules/users';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import routes from '@routes';
import { TagIcon, CalendarIcon, DownloadLink, EditIcon, Link } from '@components';
import { afficherDate } from '@views/helpers';
import { Etape } from './Etape';
import { DossierRaccordementReadModel } from '@potentiel/domain';
import { Separateur } from './Separateur';

export type Dossier = DossierRaccordementReadModel & {
  hasPTFFile: boolean;
  hasDCRFile: boolean;
};

export const Dossier: FC<{
  user: UtilisateurReadModel;
  identifiantProjet: string;
  dossier: Dossier;
}> = ({
  user,
  identifiantProjet,
  dossier: {
    référence,
    dateQualification,
    propositionTechniqueEtFinancière,
    dateMiseEnService,
    hasDCRFile,
    hasPTFFile,
  },
}) => (
  <div className="flex flex-col md:flex-row justify-items-stretch">
    <Etape
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
          ) : userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user) ? (
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
        {userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user) && (
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
    <Separateur />
    <Etape
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
          {userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user) && (
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
    <Separateur />
    <Etape statut={dateMiseEnService ? 'étape validée' : 'étape à venir'} titre="Mise en service">
      {dateMiseEnService ? (
        <div className="flex items-center">
          <div>
            <CalendarIcon className="mr-1" title="date de mise en service" />
            {afficherDate(new Date(dateMiseEnService))}
          </div>
          {userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user) && (
            <Link
              href={routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(identifiantProjet, référence)}
              className="absolute top-2 right-2 text-sm"
            >
              <EditIcon aria-hidden className="mr-1" />
              Modifier
            </Link>
          )}
        </div>
      ) : userIs(['admin'])(user) ? (
        <Link
          className="mt-4 text-center"
          href={routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(identifiantProjet, référence)}
        >
          Transmettre
        </Link>
      ) : (
        <p>La date de mise en service sera renseignée par la DGEC.</p>
      )}
    </Etape>
  </div>
);
