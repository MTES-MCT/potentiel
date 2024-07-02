'use client';

import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';
import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { Tile } from '@/components/organisms/Tile';
import { PageTemplate } from '@/components/templates/Page.template';

import { TitrePageRaccordement } from '../TitrePageRaccordement';

import { DossierRaccordement, DossierRaccordementProps } from './components/DossierRaccordement';
import { ModifierGestionnaireRéseauDuRaccordement } from './components/ModifierGestionnaireRéseauDuRaccordement';
import { GestionnaireRéseau as GestionnaireRéseauProps } from './type';

export type DétailsRaccordementPageProps = {
  projet: ProjetBannerProps;
  gestionnaireRéseau?: GestionnaireRéseauProps;
  dossiers: ReadonlyArray<DossierRaccordementProps>;
};

export const DétailsRaccordementPage: FC<DétailsRaccordementPageProps> = ({
  projet,
  gestionnaireRéseau,
  dossiers,
}) => {
  const isGestionnaireInconnu = gestionnaireRéseau
    ? GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        gestionnaireRéseau.identifiantGestionnaireRéseau,
      ).estÉgaleÀ(GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu)
    : false;
  return (
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      <TitrePageRaccordement />
      <div className="my-2 md:my-4">
        {gestionnaireRéseau && (
          <ModifierGestionnaireRéseauDuRaccordement
            gestionnaireRéseau={gestionnaireRéseau}
            identifiantProjet={projet.identifiantProjet}
            isGestionnaireInconnu={isGestionnaireInconnu}
          />
        )}
        {dossiers.length === 1 ? (
          <DossierRaccordement {...dossiers[0]} isGestionnaireInconnu={isGestionnaireInconnu} />
        ) : (
          dossiers.map((dossier) => (
            <Tile key={dossier.référence} className="mb-3">
              <DossierRaccordement {...dossier} isGestionnaireInconnu={isGestionnaireInconnu} />
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
};
