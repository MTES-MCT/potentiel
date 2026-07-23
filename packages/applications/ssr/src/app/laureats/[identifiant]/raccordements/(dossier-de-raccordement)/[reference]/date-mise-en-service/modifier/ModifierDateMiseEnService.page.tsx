import type { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { TitrePageRaccordement } from '../../../../TitrePageRaccordement';
import { DateMiseEnServiceForm, type DateMiseEnServiceFormProps } from '../DateMiseEnService.form';
import { DateMiseEnServiceAlert } from '../DateMiseEnServiceAlert';
import { SupprimerDateMiseEnService } from '../supprimer-date-mise-en-service/SupprimerDateMiseEnService.form';
import { modifierDateMiseEnServiceAction } from './modifierDateMiseEnService.action';

export type ModifierDateMiseEnServicePageProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  dateDésignation: DateTime.RawType;
  dossierRaccordement: DateMiseEnServiceFormProps['dossierRaccordement'];
  intervalleDatesMeSDélaiCDC2022?: { min: DateTime.RawType; max: DateTime.RawType };
  peutSupprimer: boolean;
};

export const ModifierDateMiseEnServicePage = ({
  identifiantProjet,
  dateDésignation,
  dossierRaccordement,
  intervalleDatesMeSDélaiCDC2022,
  peutSupprimer,
}: ModifierDateMiseEnServicePageProps) => (
  <ColumnPageTemplate
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <DateMiseEnServiceForm
          identifiantProjet={identifiantProjet}
          dateDésignation={dateDésignation}
          dossierRaccordement={dossierRaccordement}
          action={modifierDateMiseEnServiceAction}
          submitLabel="Modifier"
        />
      ),
    }}
    rightColumn={{
      children: (
        <>
          {peutSupprimer && dossierRaccordement.dateMiseEnService && (
            <SupprimerDateMiseEnService
              identifiantProjet={identifiantProjet}
              référenceDossier={dossierRaccordement.référence}
              dateMiseEnService={dossierRaccordement.dateMiseEnService}
            />
          )}
          <DateMiseEnServiceAlert
            intervalleDatesMeSDélaiCDC2022={intervalleDatesMeSDélaiCDC2022}
            dateDésignation={dateDésignation}
          />
        </>
      ),
    }}
  />
);
