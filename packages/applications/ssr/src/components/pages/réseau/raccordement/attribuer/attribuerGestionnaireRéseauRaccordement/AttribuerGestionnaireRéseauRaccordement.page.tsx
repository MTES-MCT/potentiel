import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';

import {
  AttribuerGestionnaireRéseauRaccordementForm,
  AttribuerGestionnaireRéseauRaccordementFormProps,
} from './AttribuerGestionnaireRéseauRaccordement.form';

export type AttribuerGestionnaireRéseauRaccordementPageProps = {
  identifiantProjet: AttribuerGestionnaireRéseauRaccordementFormProps['identifiantProjet'];
  identifiantGestionnaireRéseauActuel: AttribuerGestionnaireRéseauRaccordementFormProps['identifiantGestionnaireRéseauActuel'];
  listeGestionnairesRéseau: AttribuerGestionnaireRéseauRaccordementFormProps['listeGestionnairesRéseau'];
};

export const AttribuerGestionnaireRéseauRaccordementPage: FC<
  AttribuerGestionnaireRéseauRaccordementPageProps
> = ({ identifiantProjet, identifiantGestionnaireRéseauActuel, listeGestionnairesRéseau }) => (
  <ColumnPageTemplate
    banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <AttribuerGestionnaireRéseauRaccordementForm
          identifiantProjet={identifiantProjet}
          identifiantGestionnaireRéseauActuel={identifiantGestionnaireRéseauActuel}
          listeGestionnairesRéseau={listeGestionnairesRéseau}
        />
      ),
    }}
    rightColumn={{
      children: (
        <Alert
          severity="info"
          small
          title="Concernant l'attribution"
          description={
            <div className="py-4 text-justify">
              Cette information sera ensuite appliquée sur tous les dossiers de raccordements du
              projet.
            </div>
          }
        />
      ),
    }}
  />
);
