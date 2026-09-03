import Notice from '@codegouvfr/react-dsfr/Notice';

import type { DateTime } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';

type DateMiseEnServiceAlertProps = {
  dateDésignation: DateTime.RawType;
  intervalleDatesMeSDélaiCDC2022?: { min: DateTime.RawType; max: DateTime.RawType };
};

// viovio a vérifier
export const DateMiseEnServiceAlert = ({
  dateDésignation,
  intervalleDatesMeSDélaiCDC2022,
}: DateMiseEnServiceAlertProps) => (
  <Notice
    severity="info"
    title=""
    description={
      <span className="py-4 text-justify">
        <span className="flex flex-col gap-3">
          <span>
            La mise en service correspond à la mise en exploitation des ouvrages de raccordement
            permettant la première injection sur le réseau d'électricité pour l'installation.
          </span>
          {intervalleDatesMeSDélaiCDC2022 && (
            <span>
              Si le projet{' '}
              <span className="font-bold">
                a bénéficié du délai supplémentaire relatif du cahier des charges du 30/08/2022
              </span>
              , la saisie d'une date de mise en service non comprise entre le{' '}
              <FormattedDate className="font-bold" date={intervalleDatesMeSDélaiCDC2022.min} /> et
              le <FormattedDate className="font-bold" date={intervalleDatesMeSDélaiCDC2022.max} />{' '}
              peut remettre en cause l'application de ce délai et entraîner une modification de la
              date d'achèvement du projet.
            </span>
          )}
          <span>
            Si le projet{' '}
            <span className="font-bold">
              n'a pas bénéficié du délai supplémentaire relatif du cahier des charges du 30/08/2022
            </span>
            , la saisie d'une date de mise en service doit être comprise entre la date de
            désignation du projet <FormattedDate className="font-bold" date={dateDésignation} /> et{' '}
            <span className="font-bold">ce jour</span>.
          </span>
        </span>
      </span>
    }
  />
);
