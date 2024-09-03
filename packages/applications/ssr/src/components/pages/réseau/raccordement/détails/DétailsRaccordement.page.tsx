import Button from '@codegouvfr/react-dsfr/Button';
import { FC } from 'react';
import { fr } from '@codegouvfr/react-dsfr';
import Accordion from '@codegouvfr/react-dsfr/Accordion';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';

import { TitrePageRaccordement } from '../TitrePageRaccordement';

import { DossierRaccordement, DossierRaccordementProps } from './components/DossierRaccordement';
import { ModifierGestionnaireRéseauDuRaccordement } from './components/ModifierGestionnaireRéseauDuRaccordement';
import { GestionnaireRéseau as GestionnaireRéseauProps } from './type';

export type DétailsRaccordementPageProps = {
  identifiantProjet: string;
  gestionnaireRéseau?: GestionnaireRéseauProps;
  dossiers: ReadonlyArray<DossierRaccordementProps>;
};

export const DétailsRaccordementPage: FC<DétailsRaccordementPageProps> = ({
  identifiantProjet,
  gestionnaireRéseau,
  dossiers,
}) => {
  const isGestionnaireInconnu = gestionnaireRéseau
    ? GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        gestionnaireRéseau.identifiantGestionnaireRéseau,
      ).estÉgaleÀ(GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu)
    : false;

  return (
    <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
      <TitrePageRaccordement />
      <div className="my-2 md:my-4">
        <div className="flex flex-col md:flex-row items-start justify-between">
          {gestionnaireRéseau && (
            <ModifierGestionnaireRéseauDuRaccordement
              gestionnaireRéseau={gestionnaireRéseau}
              identifiantProjet={identifiantProjet}
              isGestionnaireInconnu={isGestionnaireInconnu}
            />
          )}
          <Button
            priority="secondary"
            iconId="fr-icon-add-circle-line"
            linkProps={{
              href: Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet),
            }}
          >
            Ajouter un dossier de raccordement
          </Button>
        </div>

        <Alert
          severity="info"
          small
          description={
            <div className="p-3">
              Si le raccordement comporte plusieurs points d'injection, vous devez ajouter un
              nouveau dossier de raccordement.
            </div>
          }
        />

        <div className={`my-8 flex flex-col gap-8 md:gap-3 ${fr.cx('fr-accordions-group')}`}>
          {dossiers.length === 1 ? (
            <DossierRaccordement {...dossiers[0]} isGestionnaireInconnu={isGestionnaireInconnu} />
          ) : (
            dossiers.map((dossier) => (
              <Accordion
                label={`Dossier avec la référence ${dossier.référence}`}
                key={dossier.référence}
              >
                <DossierRaccordement {...dossier} isGestionnaireInconnu={isGestionnaireInconnu} />
              </Accordion>
            ))
          )}
        </div>
      </div>

      <Button
        priority="secondary"
        linkProps={{ href: Routes.Projet.details(identifiantProjet), prefetch: false }}
        className="mt-4"
        iconId="fr-icon-arrow-left-line"
      >
        Retour vers le projet
      </Button>
    </PageTemplate>
  );
};
