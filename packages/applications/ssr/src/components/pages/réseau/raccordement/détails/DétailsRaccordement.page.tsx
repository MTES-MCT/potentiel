import Button from '@codegouvfr/react-dsfr/Button';
import { FC } from 'react';
import { fr } from '@codegouvfr/react-dsfr';
import Accordion from '@codegouvfr/react-dsfr/Accordion';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';

import { TitrePageRaccordement } from '../TitrePageRaccordement';

import { DossierRaccordement, DossierRaccordementProps } from './components/DossierRaccordement';
import { ModifierGestionnaireRéseauDuRaccordement } from './components/ModifierGestionnaireRéseauDuRaccordement';

export type DétailsRaccordementPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  gestionnaireRéseau: PlainType<
    Option.Type<GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel>
  >;
  raccordement: PlainType<Raccordement.ConsulterRaccordementReadModel>;
  actions: DossierRaccordementProps['actions'] & { gestionnaireRéseau: { modifier: boolean } };
  lienRetour: {
    label: string;
    href: string;
  };
};

export const DétailsRaccordementPage: FC<DétailsRaccordementPageProps> = ({
  identifiantProjet,
  gestionnaireRéseau,
  raccordement,
  actions,
  lienRetour: { label, href },
}) => {
  const identifiantProjetValue = IdentifiantProjet.bind(identifiantProjet).formatter();
  return (
    <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjetValue} />}>
      <TitrePageRaccordement />
      <div className="my-2 md:my-4">
        <div className="flex flex-col md:flex-row items-start justify-between">
          {Option.isSome(gestionnaireRéseau) && (
            <ModifierGestionnaireRéseauDuRaccordement
              gestionnaireRéseau={gestionnaireRéseau}
              identifiantProjet={identifiantProjetValue}
              actions={actions.gestionnaireRéseau}
            />
          )}
          {actions.demandeComplèteRaccordement.transmettre && (
            <Button
              priority="secondary"
              iconId="fr-icon-add-circle-line"
              linkProps={{
                href: Routes.Raccordement.transmettreDemandeComplèteRaccordement(
                  identifiantProjetValue,
                ),
              }}
            >
              Ajouter un dossier de raccordement
            </Button>
          )}
        </div>

        {actions.demandeComplèteRaccordement.transmettre && (
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
        )}

        <div className={`my-8 flex flex-col gap-8 md:gap-3 ${fr.cx('fr-accordions-group')}`}>
          {raccordement.dossiers.length === 1 ? (
            <DossierRaccordement
              dossier={raccordement.dossiers[0]}
              identifiantProjet={identifiantProjetValue}
              actions={actions}
            />
          ) : (
            raccordement.dossiers.map((dossier) => (
              <Accordion
                label={`Dossier avec la référence ${dossier.référence.référence}`}
                key={dossier.référence.référence}
              >
                <DossierRaccordement
                  dossier={dossier}
                  identifiantProjet={identifiantProjetValue}
                  actions={actions}
                />
              </Accordion>
            ))
          )}
        </div>
      </div>

      <Button
        priority="secondary"
        linkProps={{
          href,
          prefetch: false,
        }}
        className="mt-4"
        iconId="fr-icon-arrow-left-line"
      >
        {label}
      </Button>
    </PageTemplate>
  );
};
