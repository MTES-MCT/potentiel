'use client';

import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';
import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { Icon } from '@/components/atoms/Icon';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { Tile } from '@/components/organisms/Tile';
import { PageTemplate } from '@/components/templates/Page.template';

import { TitrePageRaccordement } from '../TitrePageRaccordement';

import { DossierRaccordement, DossierRaccordementProps } from './components/DossierRaccordement';

export type DétailsRaccordementPageProps = {
  projet: ProjetBannerProps;
  gestionnaireRéseau?: {
    identifiantGestionnaireRéseau: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
    contactEmail?: string;
    canEdit: boolean;
  };
  dossiers: ReadonlyArray<DossierRaccordementProps>;
};

export const DétailsRaccordementPage: FC<DétailsRaccordementPageProps> = ({
  projet,
  gestionnaireRéseau,
  dossiers,
}) => (
  <PageTemplate banner={<ProjetBanner {...projet} />}>
    <TitrePageRaccordement />
    <div className="my-2 md:my-4">
      {gestionnaireRéseau && (
        <p className="mt-2 mb-4 p-0">
          Gestionnaire de réseau : {gestionnaireRéseau.raisonSociale}
          {gestionnaireRéseau.contactEmail && `, contact: ${gestionnaireRéseau.contactEmail}`}
          {gestionnaireRéseau.canEdit && (
            <a
              className="ml-1"
              href={Routes.Raccordement.modifierGestionnaireDeRéseau(projet.identifiantProjet)}
              aria-label={`Modifier le gestionnaire (actuel : ${gestionnaireRéseau.raisonSociale})`}
            >
              (<Icon id="fr-icon-pencil-fill" size="xs" className="mr-1" />
              Modifier)
            </a>
          )}
        </p>
      )}
      {dossiers.length === 1 ? (
        <DossierRaccordement {...dossiers[0]} />
      ) : (
        dossiers.map((dossier) => (
          <Tile key={dossier.référence} className="mb-3">
            <DossierRaccordement {...dossier} />
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
          <Link
            href={Routes.Raccordement.transmettreDemandeComplèteRaccordement(
              projet.identifiantProjet,
            )}
            className="font-semibold"
          >
            transmettre une autre demande complète de raccordement
          </Link>
          .
        </div>
      }
    />

    <Button
      priority="secondary"
      linkProps={{ href: Routes.Projet.details(projet.identifiantProjet) }}
      className="mt-4"
      iconId="fr-icon-arrow-left-line"
    >
      Retour vers le projet
    </Button>
  </PageTemplate>
);
