import Alert from '@codegouvfr/react-dsfr/Alert';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';

import {
  TransmettreDateMiseEnServiceForm,
  TransmettreDateMiseEnServiceFormProps,
} from './TransmettreDateMiseEnService.form';

export type TransmettreDateMiseEnServicePageProps = {
  projet: TransmettreDateMiseEnServiceFormProps['projet'];
  dossierRaccordement: TransmettreDateMiseEnServiceFormProps['dossierRaccordement'];
  intervalleDatesMeSDélaiCDC2022?: { min: Iso8601DateTime; max: Iso8601DateTime };
  lienRetour: TransmettreDateMiseEnServiceFormProps['lienRetour'];
};

export const TransmettreDateMiseEnServicePage = ({
  projet,
  dossierRaccordement,
  intervalleDatesMeSDélaiCDC2022,
  lienRetour,
}: TransmettreDateMiseEnServicePageProps) => (
  <ColumnPageTemplate
    banner={<ProjetBanner identifiantProjet={projet.identifiantProjet} />}
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <TransmettreDateMiseEnServiceForm
          projet={projet}
          dossierRaccordement={dossierRaccordement}
          lienRetour={lienRetour}
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
