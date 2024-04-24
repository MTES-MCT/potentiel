'use client';

import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Form } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';

import { transmettreDateMiseEnServiceAction } from './transmettreDateMiseEnService.action';

export type TransmettreDateMiseEnServiceProps = {
  projet: ProjetBannerProps;
  dossierRaccordement: {
    référence: string;
    miseEnService?: Iso8601DateTime;
  };
  intervalleDatesMeSDélaiCDC2022?: { min: Iso8601DateTime; max: Iso8601DateTime };
};

export const TransmettreDateMiseEnServicePage = ({
  projet,
  dossierRaccordement: { référence, miseEnService },
  intervalleDatesMeSDélaiCDC2022,
}: TransmettreDateMiseEnServiceProps) => {
  const router = useRouter();
  const { identifiantProjet, dateDésignation } = projet;

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner {...projet} />}
      heading={<TitrePageRaccordement />}
      leftColumn={{
        children: (
          <Form
            method="POST"
            heading="Transmettre la date de mise en service"
            action={transmettreDateMiseEnServiceAction}
            onSuccess={() => router.push(Routes.Raccordement.détail(identifiantProjet))}
            buttons={
              <>
                <Button
                  priority="secondary"
                  linkProps={{
                    href: Routes.Raccordement.détail(identifiantProjet),
                  }}
                  iconId="fr-icon-arrow-left-line"
                >
                  Retour aux dossiers de raccordement
                </Button>
                <SubmitButton>Transmettre</SubmitButton>
              </>
            }
          >
            <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
            <input type="hidden" name="referenceDossier" value={référence} />
            <input type="hidden" name="dateDesignation" value={dateDésignation} />

            <InputDate
              label="Date de mise en service"
              nativeInputProps={{
                type: 'date',
                name: 'dateMiseEnService',
                defaultValue: miseEnService,
                min: projet.dateDésignation,
                max: now(),
                required: true,
                'aria-required': true,
              }}
            />
          </Form>
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
};
