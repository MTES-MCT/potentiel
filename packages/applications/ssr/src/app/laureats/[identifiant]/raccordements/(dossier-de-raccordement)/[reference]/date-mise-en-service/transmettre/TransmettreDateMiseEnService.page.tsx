import type { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet } from '@potentiel-domain/projet';
import type { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { TitrePageRaccordement } from '../../../../TitrePageRaccordement';
import { DateMiseEnServiceForm, type DateMiseEnServiceFormProps } from '../DateMiseEnService.form';
import { DateMiseEnServiceAlert } from '../DateMiseEnServiceAlert';
import { transmettreDateMiseEnServiceAction } from './transmettreDateMiseEnService.action';

export type TransmettreDateMiseEnServicePageProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  dateDésignation: DateTime.RawType;
  dossierRaccordement: DateMiseEnServiceFormProps['dossierRaccordement'];
  intervalleDatesMeSDélaiCDC2022?: { min: Iso8601DateTime; max: Iso8601DateTime };
};

export const TransmettreDateMiseEnServicePage = ({
  identifiantProjet,
  dateDésignation,
  dossierRaccordement,
  intervalleDatesMeSDélaiCDC2022,
}: TransmettreDateMiseEnServicePageProps) => (
  <ColumnPageTemplate
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <DateMiseEnServiceForm
          identifiantProjet={identifiantProjet}
          dateDésignation={dateDésignation}
          dossierRaccordement={dossierRaccordement}
          action={transmettreDateMiseEnServiceAction}
          submitLabel="Transmettre"
        />
      ),
    }}
    rightColumn={{
      children: (
        <DateMiseEnServiceAlert
          intervalleDatesMeSDélaiCDC2022={intervalleDatesMeSDélaiCDC2022}
          dateDésignation={dateDésignation}
        />
      ),
    }}
  />
);
