import Alert from '@codegouvfr/react-dsfr/Alert';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { TitrePageRaccordement } from '../../pages/réseau/raccordement/TitrePageRaccordement';

import {
  EnregistrerDateMiseEnServiceForm,
  EnregistrerDateMiseEnServiceFormProps,
} from './EnregistrerDateMiseEnService.form';

export type EnregistrerDateMiseEnServicePageProps = {
  usecase: EnregistrerDateMiseEnServiceFormProps['usecase'];
  projet: EnregistrerDateMiseEnServiceFormProps['projet'];
  dossierRaccordement: EnregistrerDateMiseEnServiceFormProps['dossierRaccordement'];
  intervalleDatesMeSDélaiCDC2022?: { min: Iso8601DateTime; max: Iso8601DateTime };
};

export const EnregistrerDateMiseEnServicePage = ({
  usecase,
  projet,
  dossierRaccordement,
  intervalleDatesMeSDélaiCDC2022,
}: EnregistrerDateMiseEnServicePageProps) => (
  <ColumnPageTemplate
    banner={<ProjetBanner identifiantProjet={projet.identifiantProjet} />}
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <EnregistrerDateMiseEnServiceForm
          projet={projet}
          dossierRaccordement={dossierRaccordement}
          usecase={usecase}
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
              <ul className="flex flex-col gap-3">
                {intervalleDatesMeSDélaiCDC2022 && (
                  <li>
                    Si le projet{' '}
                    <span className="font-bold">
                      a bénéficié du délai supplémentaire relatif du cahier des charges du
                      30/08/2022
                    </span>
                    , la saisie d'une date de mise en service non comprise entre le{' '}
                    <FormattedDate
                      className="font-bold"
                      date={intervalleDatesMeSDélaiCDC2022.min}
                    />{' '}
                    et le{' '}
                    <FormattedDate
                      className="font-bold"
                      date={intervalleDatesMeSDélaiCDC2022.max}
                    />{' '}
                    peut remettre en cause l'application de ce délai et entraîner une modification
                    de la date d'achèvement du projet.
                  </li>
                )}
                <li>
                  Si le projet{' '}
                  <span className="font-bold">
                    n'a pas bénéficié du délai supplémentaire relatif du cahier des charges du
                    30/08/2022
                  </span>
                  , la saisie d'une date de mise en service doit être comprise entre la date de
                  désignation du projet{' '}
                  <FormattedDate className="font-bold" date={projet.dateDésignation} /> et{' '}
                  <span className="font-bold">ce jour</span>.
                </li>
              </ul>
            </div>
          }
        />
      ),
    }}
  />
);
