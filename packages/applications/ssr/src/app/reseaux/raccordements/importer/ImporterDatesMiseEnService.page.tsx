import Alert from '@codegouvfr/react-dsfr/Alert';
import { Table } from '@codegouvfr/react-dsfr/Table';
import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { GestionnaireRéseauSelectProps } from '@/app/laureats/[identifiant]/raccordements/(raccordement-du-projet)/(gestionnaire-réseau)/GestionnaireRéseauSelect';

import { ImporterDatesMiseEnServiceForm } from './ImporterDatesMiseEnService.form';

export type ImporterDatesMiseEnServicePageProps = {
  gestionnaireRéseauActuel: GestionnaireRéseauSelectProps['gestionnaireRéseauActuel'];
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['listeGestionnairesRéseau'];
};

export const ImporterDatesMiseEnServicePage: FC<ImporterDatesMiseEnServicePageProps> = ({
  gestionnaireRéseauActuel,
  listeGestionnairesRéseau,
}) => (
  <ColumnPageTemplate
    banner={<Heading1 className="text-theme-white">Importer des dates de mise en service</Heading1>}
    leftColumn={{
      children: (
        <ImporterDatesMiseEnServiceForm
          gestionnaireRéseauActuel={gestionnaireRéseauActuel}
          listeGestionnairesRéseau={listeGestionnairesRéseau}
        />
      ),
    }}
    rightColumn={{
      children: (
        <Alert
          severity="info"
          small
          description={
            <div className="py-4 text-justify">
              <Table
                className="lg:mx-4 my-4 border-spacing-0"
                caption="Résumé du tableau attendu pour l'import des dates de mise en service"
                headers={['Colonne', 'Format', 'Optionnel']}
                data={[
                  ['identifiantProjet', 'chaîne de caractères', 'oui'],
                  ['referenceDossier', 'chaîne de caractères', 'non'],
                  ['dateMiseEnService', 'date au format JJ/MM/AAAA', 'non'],
                ]}
              />
            </div>
          }
        />
      ),
    }}
  />
);
