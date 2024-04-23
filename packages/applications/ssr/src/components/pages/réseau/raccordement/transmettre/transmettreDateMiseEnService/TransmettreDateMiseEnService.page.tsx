'use client';

import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Iso8601DateTime, formatDate, now } from '@/utils/formatDate';

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
          >
            <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
            <input type="hidden" name="referenceDossier" value={référence} />
            <input type="hidden" name="dateDesignation" value={dateDésignation} />

            <Input
              label="Date de mise en service"
              nativeInputProps={{
                type: 'date',
                name: 'dateMiseEnService',
                defaultValue: miseEnService && formatDate(miseEnService, 'yyyy-MM-dd'),
                min: formatDate(projet.dateDésignation, 'yyyy-MM-dd'),
                max: formatDate(now(), 'yyyy-MM-dd'),
                required: true,
                'aria-required': true,
              }}
            />

            <div className="flex flex-col md:flex-row gap-4 md:mt-4">
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
            </div>
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
                      <span className="font-bold">
                        {formatDate(intervalleDatesMeSDélaiCDC2022.min, 'dd/MM/yyyy')}
                      </span>{' '}
                      et le{' '}
                      <span className="font-bold">
                        {formatDate(intervalleDatesMeSDélaiCDC2022.max, 'dd/MM/yyyy')}
                      </span>{' '}
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
                    désignation du projet (
                    <span className="font-bold">
                      {formatDate(projet.dateDésignation, 'dd/MM/yyyy')}
                    </span>
                    ) et <span className="font-bold">ce jour</span>.
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
