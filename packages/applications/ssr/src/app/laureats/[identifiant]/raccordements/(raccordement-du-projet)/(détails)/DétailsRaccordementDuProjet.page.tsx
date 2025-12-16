import Button from '@codegouvfr/react-dsfr/Button';
import { FC } from 'react';
import { fr } from '@codegouvfr/react-dsfr';
import Accordion from '@codegouvfr/react-dsfr/Accordion';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import {
  DossierRaccordement,
  DossierRaccordementProps,
} from '../../(dossier-de-raccordement)/components/DossierRaccordement';

import {
  ModifierGestionnaireRéseauDuRaccordement,
  ModifierGestionnaireRéseauDuRaccordementProps,
} from './ModifierGestionnaireRéseauDuRaccordement';

export type DétailsRaccordementPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  gestionnaireRéseau: ModifierGestionnaireRéseauDuRaccordementProps['gestionnaireRéseau'];
  dossiers: Array<
    PlainType<Lauréat.Raccordement.ConsulterDossierRaccordementReadModel> & {
      actions: DossierRaccordementProps['actions'];
    }
  >;
  actions: {
    gestionnaireRéseau: { modifier: boolean };
    créerNouveauDossier: boolean;
  };
  lienRetour: {
    label: string;
    href: string;
  };
};

export const DétailsRaccordementDuProjetPage: FC<DétailsRaccordementPageProps> = ({
  identifiantProjet,
  gestionnaireRéseau,
  dossiers,
  actions,
  lienRetour: { label, href },
}) => {
  const identifiantProjetValue = IdentifiantProjet.bind(identifiantProjet).formatter();
  return (
    <>
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
          {actions.créerNouveauDossier && (
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

        {actions.créerNouveauDossier && (
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
          {dossiers.length === 1 ? (
            <DossierRaccordement
              dossier={dossiers[0]}
              identifiantProjet={identifiantProjetValue}
              actions={dossiers[0].actions}
            />
          ) : (
            dossiers.map((dossier) => (
              <Accordion
                label={`Dossier avec la référence ${dossier.référence.référence}`}
                key={dossier.référence.référence}
              >
                <DossierRaccordement
                  dossier={dossier}
                  identifiantProjet={identifiantProjetValue}
                  actions={dossier.actions}
                />
              </Accordion>
            ))
          )}
        </div>
      </div>

      <Button
        priority="secondary"
        linkProps={{ href }}
        className="mt-4"
        iconId="fr-icon-arrow-left-line"
      >
        {label}
      </Button>
    </>
  );
};
