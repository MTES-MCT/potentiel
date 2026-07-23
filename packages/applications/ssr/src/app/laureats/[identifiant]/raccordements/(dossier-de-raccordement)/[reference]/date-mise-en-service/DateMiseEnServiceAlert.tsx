import Alert from '@codegouvfr/react-dsfr/Alert';

import type { DateTime } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';

type Props = {
  dateDésignation: DateTime.RawType;
  intervalleDatesMeSDélaiCDC2022?: { min: DateTime.RawType; max: DateTime.RawType };
};

export const DateMiseEnServiceAlert = ({
  dateDésignation,
  intervalleDatesMeSDélaiCDC2022,
}: Props) => {
  return (
    <Alert
      severity="info"
      small
      description={
        <div className="py-4 text-justify">
          <ul className="flex flex-col gap-3">
            <li>
              La mise en service correspond à la mise en exploitation des ouvrages de raccordement
              permettant la première injection sur le réseau d'électricité pour l'installation.
            </li>
            {intervalleDatesMeSDélaiCDC2022 && (
              <li>
                Si le projet{' '}
                <span className="font-bold">
                  a bénéficié du délai supplémentaire relatif du cahier des charges du 30/08/2022
                </span>
                , la saisie d'une date de mise en service non comprise entre le{' '}
                <FormattedDate className="font-bold" date={intervalleDatesMeSDélaiCDC2022.min} /> et
                le <FormattedDate className="font-bold" date={intervalleDatesMeSDélaiCDC2022.max} />{' '}
                peut remettre en cause l'application de ce délai et entraîner une modification de la
                date d'achèvement du projet.
              </li>
            )}
            <li>
              Si le projet{' '}
              <span className="font-bold">
                n'a pas bénéficié du délai supplémentaire relatif du cahier des charges du
                30/08/2022
              </span>
              , la saisie d'une date de mise en service doit être comprise entre la date de
              désignation du projet <FormattedDate className="font-bold" date={dateDésignation} />{' '}
              et <span className="font-bold">ce jour</span>.
            </li>
          </ul>
        </div>
      }
    />
  );
};
