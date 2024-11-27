import Alert from '@codegouvfr/react-dsfr/Alert';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { EnregistrerDateMiseEnServiceAlert } from '@/components/organisms/raccordement/EnregistrerDateMiseEnServiceAlert';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import {
  EnregistrerDateMiseEnServiceForm,
  EnregistrerDateMiseEnServiceFormProps,
} from '../../../../../organisms/raccordement/EnregistrerDateMiseEnService.form';

import { modifierDateMiseEnServiceAction } from './modifierDateMiseEnService.action';

export type ModifierDateMiseEnServicePageProps = {
  projet: EnregistrerDateMiseEnServiceFormProps['projet'];
  dossierRaccordement: EnregistrerDateMiseEnServiceFormProps['dossierRaccordement'];
  intervalleDatesMeSDélaiCDC2022?: { min: Iso8601DateTime; max: Iso8601DateTime };
};

export const ModifierDateMiseEnServicePage = ({
  projet,
  dossierRaccordement,
  intervalleDatesMeSDélaiCDC2022,
}: ModifierDateMiseEnServicePageProps) => (
  <ColumnPageTemplate
    banner={<ProjetBanner identifiantProjet={projet.identifiantProjet} />}
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <EnregistrerDateMiseEnServiceForm
          projet={projet}
          dossierRaccordement={dossierRaccordement}
          action={modifierDateMiseEnServiceAction}
        />
      ),
    }}
    rightColumn={{
      children: (
        <Alert
          severity="info"
          small
          description={
            <EnregistrerDateMiseEnServiceAlert
              intervalleDatesMeSDélaiCDC2022={intervalleDatesMeSDélaiCDC2022}
              dateDésignation={projet.dateDésignation}
            />
          }
        />
      ),
    }}
  />
);
