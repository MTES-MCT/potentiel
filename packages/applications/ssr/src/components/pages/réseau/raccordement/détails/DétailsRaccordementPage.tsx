'use client';

import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Download from '@codegouvfr/react-dsfr/Download';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-libraries/routes';

import { Tile } from '@/components/organisms/Tile';
import {
  ArrowDownWithCircle,
  ArrowLeftIcon,
  ArrowRightWithCircle,
  CalendarIcon,
  ClockIcon,
  EditIcon,
  SuccessIcon,
  TagIcon,
  WarningIcon,
} from '@/components/atoms/icons';

import { TitrePageRaccordement } from '../TitrePageRaccordement';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

export type DétailsRaccordementPageProps = {
  projet: ProjetBannerProps;
  gestionnaireRéseau: {
    identifiantGestionnaireRéseau: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
    canEdit: boolean;
  };
  dossiers: ReadonlyArray<DossierRaccordementProps>;
};

export const DétailsRaccordementPage: FC<DétailsRaccordementPageProps> = ({
  projet,
  gestionnaireRéseau,
  dossiers,
}) => {
  const { identifiantProjet } = projet;

  return (
    <>
      <PageTemplate type="projet" projet={projet} heading={<TitrePageRaccordement />}>
        <div className="my-2 md:my-4">
          <p className="mt-2 mb-4 p-0">
            Gestionnaire de réseau : {gestionnaireRéseau.raisonSociale}
            {gestionnaireRéseau.canEdit && (
              <a
                className="ml-1"
                href={Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet)}
                aria-label={`Modifier le gestionnaire (actuel : ${gestionnaireRéseau.raisonSociale})`}
              >
                (<EditIcon className="inline mr-1" />
                Modifier)
              </a>
            )}
          </p>
          {dossiers.length === 1 ? (
            <Dossier {...dossiers[0]} />
          ) : (
            dossiers.map((dossier) => (
              <Tile key={dossier.référence} className="mb-3">
                <Dossier {...dossier} />
              </Tile>
            ))
          )}
        </div>

        <Alert
          severity="info"
          small
          description={
            <div className="p-3">
              Si le raccordement comporte plusieurs points d'injection, vous pouvez{' '}
              <a
                href={Routes.Raccordement.transmettreDemandeComplèteDeRaccordement(
                  identifiantProjet,
                )}
              >
                transmettre une autre demande complète de raccordement
              </a>
              .
            </div>
          }
        />

        <Button
          priority="secondary"
          linkProps={{ href: Routes.Projet.details(projet.identifiantProjet) }}
          className="mt-4"
        >
          <ArrowLeftIcon aria-hidden className="inline w-5 h-5 mr-2" />
          Retour vers le projet
        </Button>
      </PageTemplate>
    </>
  );
};

type DossierRaccordementProps = {
  identifiantProjet: string;
  référence: string;
  demandeComplèteRaccordement: {
    dateQualification?: string;
    accuséRéception?: string;
    canEdit: boolean;
  };
  propositionTechniqueEtFinancière: {
    dateSignature?: string;
    propositionTechniqueEtFinancièreSignée?: string;
    canEdit: boolean;
  };
  miseEnService: {
    dateMiseEnService?: string;
    canEdit: boolean;
  };
};

export const Dossier: FC<DossierRaccordementProps> = ({
  identifiantProjet,
  référence,
  demandeComplèteRaccordement,
  propositionTechniqueEtFinancière,
  miseEnService,
}) => (
  <div className="flex flex-col md:flex-row justify-items-stretch">
    <ÉtapeDemandeComplèteRaccordement
      identifiantProjet={identifiantProjet}
      référence={référence}
      dateQualification={demandeComplèteRaccordement.dateQualification}
      accuséRéception={demandeComplèteRaccordement.accuséRéception}
      canEdit={demandeComplèteRaccordement.canEdit}
    />

    <Separateur />

    <ÉtapePropositionTechniqueEtFinancière
      identifiantProjet={identifiantProjet}
      référence={référence}
      dateSignature={propositionTechniqueEtFinancière.dateSignature}
      propositionTechniqueEtFinancièreSignée={
        propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée
      }
      canEdit={propositionTechniqueEtFinancière.canEdit}
    />

    <Separateur />

    <ÉtapeMiseEnService
      identifiantProjet={identifiantProjet}
      référence={référence}
      dateMiseEnService={miseEnService.dateMiseEnService}
      canEdit={miseEnService.canEdit}
    />
  </div>
);

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
        <TagIcon className="inline mr-1" title="référence du dossier de raccordement" />
        <span className="font-bold">{référence}</span>
      </div>

      <div className="flex items-center">
        <CalendarIcon className="inline mr-1" title="date de l'accusé de réception" />
        {dateQualification ? (
          dateQualification
        ) : canEdit ? (
          <a
            href={Routes.Raccordement.modifierDemandeComplèteDeRaccordement(
              identifiantProjet,
              référence,
            )}
          >
            Date de l'accusé de réception à renseigner
          </a>
        ) : (
          <p className="font-bold">Date de l'accusé de réception manquante</p>
        )}
      </div>

      {accuséRéception && (
        <Download
          className="flex items-center"
          linkProps={{
            href: Routes.Document.télécharger(accuséRéception),
          }}
          label="Télécharger l'accusé de réception"
          details=""
          aria-label={`Télécharger l'accusé de réception pour le dossier ${référence}`}
        />
      )}

      {canEdit && (
        <a
          href={Routes.Raccordement.modifierDemandeComplèteDeRaccordement(
            identifiantProjet,
            référence,
          )}
          className="absolute top-2 right-2"
          aria-label={`Modifier la demande de raccordement ${référence}`}
        >
          <EditIcon aria-hidden className="inline mr-1" />
          Modifier
        </a>
      )}
    </div>
  </Etape>
);

type ÉtapePropositionTechniqueEtFinancièreProps = {
  identifiantProjet: string;
  référence: string;
  dateSignature?: string;
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
          <CalendarIcon
            className="mr-1"
            title="date de signature de la proposition technique et financière"
          />
          {dateSignature}
        </div>

        {propositionTechniqueEtFinancièreSignée && (
          <div>
            <Download
              className="flex items-center"
              linkProps={{
                href: Routes.Document.télécharger(propositionTechniqueEtFinancièreSignée),
              }}
              label="Télécharger"
              details=""
              aria-label={`Télécharger la proposition technique et financière pour le dossier ${référence}`}
            ></Download>
          </div>
        )}

        {canEdit && (
          <a
            href={Routes.Raccordement.modifierPropositionTechniqueEtFinancière(
              identifiantProjet,
              référence,
            )}
            className="absolute top-2 right-2"
            aria-label={`Modifier la proposition technique et financière pour le dossier ${référence}`}
          >
            <EditIcon aria-hidden className="inline mr-1" />
            Modifier
          </a>
        )}
      </div>
    ) : (
      <a
        className="mt-4 text-center"
        href={Routes.Raccordement.transmettrePropositionTechniqueEtFinancière(
          identifiantProjet,
          référence,
        )}
        aria-label={`Transmettre la proposition technique et financière pour le dossier ${référence}`}
      >
        Transmettre
      </a>
    )}
  </Etape>
);

type ÉtapeMiseEnServiceProps = {
  identifiantProjet: string;
  référence: string;
  dateMiseEnService?: string;
  canEdit: boolean;
};

export const ÉtapeMiseEnService: FC<ÉtapeMiseEnServiceProps> = ({
  identifiantProjet,
  référence,
  dateMiseEnService,
  canEdit,
}) => (
  <Etape
    className="relative"
    statut={dateMiseEnService ? 'étape validée' : 'étape à venir'}
    titre="Mise en service"
  >
    {dateMiseEnService ? (
      <div className="flex items-center text-sm">
        <div>
          <CalendarIcon className="inline mr-1" title="date de mise en service" />
          {dateMiseEnService}
        </div>

        {canEdit && (
          <a
            href={Routes.Raccordement.transmettreDateMiseEnService(identifiantProjet, référence)}
            className="absolute top-2 right-2"
            aria-label={`Modifier la date de mise en service pour le dossier ${référence}`}
          >
            <EditIcon aria-hidden className="inline mr-1" />
            Modifier
          </a>
        )}
      </div>
    ) : canEdit ? (
      <a
        className="mt-4 text-center"
        href={Routes.Raccordement.transmettreDateMiseEnService(identifiantProjet, référence)}
        aria-label={`Transmettre la date de mise en service pour le dossier ${référence}`}
      >
        Transmettre
      </a>
    ) : (
      <p>La date de mise en service sera renseignée par la DGEC.</p>
    )}
  </Etape>
);

export const Etape: FC<{
  statut: 'étape validée' | 'étape à venir' | 'étape incomplète';
  titre: string;
  className?: string;
  children: React.ReactNode;
}> = ({ statut, titre, children, className = '' }) => {
  let icon;
  let borderColor;
  let backgroundColor;

  switch (statut) {
    case 'étape validée':
      icon = (
        <SuccessIcon className="w-8 h-8 md:mx-auto text-success-425-base" title="étape validée" />
      );
      borderColor = 'border-success-425-base';
      backgroundColor = 'bg-green-50';
      break;
    case 'étape incomplète':
      icon = (
        <WarningIcon
          className="w-8 h-8 md:mx-auto text-warning-425-base"
          title="étape incomplète"
        />
      );
      borderColor = 'border-warning-425-base';
      backgroundColor = 'bg-warning-975-base';
      break;
    case 'étape à venir':
      icon = <ClockIcon className="w-8 h-8 md:mx-auto text-grey-625-base" title="étape à venir" />;
      borderColor = 'border-grey-625-base';
      backgroundColor = '';
      break;
    default:
      icon = null;
      borderColor = '';
      backgroundColor = '';
      break;
  }

  return (
    <div
      className={`flex flex-col p-5 border-2 border-solid md:w-1/3 ${borderColor} ${backgroundColor}
      ${className}`}
    >
      <div className="flex flex-row items-center md:flex-col gap-3 mb-5">
        {icon}
        <div className="uppercase font-bold text-sm">{titre}</div>
      </div>
      {children}
    </div>
  );
};

export const Separateur: FC = () => (
  <div className="flex flex-col my-3 mx-auto md:mx-3">
    <ArrowRightWithCircle
      className="w-12 h-12 my-auto text-blue-france-sun-base hidden md:block"
      aria-hidden
    />
    <ArrowDownWithCircle
      className="w-12 h-12 my-auto text-blue-france-sun-base block md:hidden"
      aria-hidden
    />
  </div>
);
