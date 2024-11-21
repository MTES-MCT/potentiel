import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';

import ScrollToTop from '@/components/molecules/ScrollToTop';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import {
  InformationDemandeComplèteRaccordement,
  InformationDemandeComplèteRaccordementProps,
} from '../../InformationDemandeComplèteRaccordement';
import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import { AucunDossierDeRaccordementAlert } from '../../détails/AucunDossierDeRaccordementAlert';

import {
  TransmettreDemandeComplèteRaccordementForm,
  TransmettreDemandeComplèteRaccordementFormProps,
} from './TransmettreDemandeComplèteRaccordement.form';

export type TransmettreDemandeComplèteRaccordementPageProps = {
  listeGestionnairesRéseau: TransmettreDemandeComplèteRaccordementFormProps['listeGestionnairesRéseau'];
  gestionnaireRéseauActuel: TransmettreDemandeComplèteRaccordementFormProps['gestionnaireRéseauActuel'];
  identifiantProjet: TransmettreDemandeComplèteRaccordementFormProps['identifiantProjet'];
  delaiDemandeDeRaccordementEnMois: InformationDemandeComplèteRaccordementProps['delaiDemandeDeRaccordementEnMois'];
  aDéjàTransmisUneDemandeComplèteDeRaccordement: boolean;
};

export const TransmettreDemandeComplèteRaccordementPage: FC<
  TransmettreDemandeComplèteRaccordementPageProps
> = ({
  listeGestionnairesRéseau,
  gestionnaireRéseauActuel,
  identifiantProjet,
  delaiDemandeDeRaccordementEnMois,
  aDéjàTransmisUneDemandeComplèteDeRaccordement,
}) => (
  <ColumnPageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
    heading={
      <>
        <ScrollToTop />
        <TitrePageRaccordement />
        {!aDéjàTransmisUneDemandeComplèteDeRaccordement && (
          <AucunDossierDeRaccordementAlert
            identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
            showLink={false}
          />
        )}
      </>
    }
    leftColumn={{
      children: (
        <TransmettreDemandeComplèteRaccordementForm
          identifiantProjet={identifiantProjet}
          listeGestionnairesRéseau={listeGestionnairesRéseau}
          gestionnaireRéseauActuel={gestionnaireRéseauActuel}
          aDéjàTransmisUneDemandeComplèteDeRaccordement={
            aDéjàTransmisUneDemandeComplèteDeRaccordement
          }
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
              <InformationDemandeComplèteRaccordement
                delaiDemandeDeRaccordementEnMois={delaiDemandeDeRaccordementEnMois}
              />
            </div>
          }
        />
      ),
    }}
  />
);
