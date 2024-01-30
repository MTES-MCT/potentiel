import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-libraries/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPageTemplate';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';

import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from './GestionnaireRéseauSelect';
import { modifierGestionnaireRéseauRaccordementAction } from './modifierGestionnaireRéseauRaccordement.action';

type ModifierGestionnaireRéseauRaccordementPageProps = {
  projet: ProjetBannerProps;
  identifiantGestionnaireRéseauActuel: string;
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['gestionnairesRéseau'];
};

export const ModifierGestionnaireRéseauRaccordementPage: FC<
  ModifierGestionnaireRéseauRaccordementPageProps
> = ({ projet, identifiantGestionnaireRéseauActuel, listeGestionnairesRéseau }) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  const { identifiantProjet } = projet;
  const gestionnaireActuel = listeGestionnairesRéseau.find(
    (gestionnaire) =>
      gestionnaire.identifiantGestionnaireRéseau === identifiantGestionnaireRéseauActuel,
  );

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner {...projet} />}
      heading={<TitrePageRaccordement />}
      leftColumn={{
        children: (
          <Form
            action={modifierGestionnaireRéseauRaccordementAction}
            method="post"
            onSuccess={() => router.push(Routes.Raccordement.détail(projet.identifiantProjet))}
            onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
            heading="Modifier le gestionnaire de réseau du projet"
          >
            <div className="flex flex-col gap-5">
              <div>
                <GestionnaireRéseauSelect
                  id="identifiantGestionnaireRéseau"
                  name="identifiantGestionnaireRéseau"
                  state={
                    validationErrors.includes('identifiantGestionnaireRéseau') ? 'error' : 'default'
                  }
                  stateRelatedMessage="Gestionnaire réseau à préciser"
                  gestionnairesRéseau={listeGestionnairesRéseau}
                  identifiantGestionnaireRéseauActuel={
                    gestionnaireActuel?.identifiantGestionnaireRéseau
                  }
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 m-auto">
                <SubmitButton>Modifier</SubmitButton>
                <a href={Routes.Raccordement.détail(identifiantProjet)} className="m-auto">
                  Retour vers le dossier de raccordement
                </a>
              </div>
            </div>
          </Form>
        ),
      }}
      rightColumn={{
        children: (
          <Alert
            severity="info"
            small
            title="Concernant la modification"
            description={
              <div className="py-4 text-justify">
                La modification de cette information sera appliquée sur tous les dossiers de
                raccordements du projet.
              </div>
            }
          />
        ),
      }}
    />
  );
};
