import Alert from '@codegouvfr/react-dsfr/Alert';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { TitrePageRaccordement } from '../../../../TitrePageRaccordement';

import {
  TransmettreDateMiseEnServiceForm,
  TransmettreDateMiseEnServiceFormProps,
} from './TransmettreDateMiseEnService.form';

export type TransmettreDateMiseEnServicePageProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  dateDésignation: DateTime.RawType;
  dossierRaccordement: TransmettreDateMiseEnServiceFormProps['dossierRaccordement'];
  intervalleDatesMeSDélaiCDC2022?: { min: Iso8601DateTime; max: Iso8601DateTime };
};

export const TransmettreDateMiseEnServicePage = ({
  identifiantProjet,
  dateDésignation,
  dossierRaccordement,
  intervalleDatesMeSDélaiCDC2022,
}: TransmettreDateMiseEnServicePageProps) => (
  <ColumnPageTemplate
    banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}
    heading={<TitrePageRaccordement />}
    leftColumn={{
      children: (
        <TransmettreDateMiseEnServiceForm
          identifiantProjet={identifiantProjet}
          dateDésignation={dateDésignation}
          dossierRaccordement={dossierRaccordement}
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
                <li>
                  La Mise en service correspond à la mise en exploitation des ouvrages de
                  raccordement permettant la première injection sur le réseau d'électricité pour
                  l'installation.
                </li>
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
                  <FormattedDate className="font-bold" date={dateDésignation} /> et{' '}
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
