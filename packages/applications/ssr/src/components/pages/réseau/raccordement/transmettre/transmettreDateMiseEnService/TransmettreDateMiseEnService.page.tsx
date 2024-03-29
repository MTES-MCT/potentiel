'use client';

import React from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import { useRouter } from 'next/navigation';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-libraries/routes';

import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { displayDate } from '@/utils/displayDate';
import { Form } from '@/components/atoms/form/Form';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { formatDateForInput } from '@/utils/formatDateForInput';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';

import { transmettreDateMiseEnServiceAction } from './transmettreDateMiseEnService.action';

export type TransmettreDateMiseEnServiceProps = {
  projet: ProjetBannerProps;
  dossierRaccordement: {
    référence: string;
    miseEnService?: string;
  };
  intervalleDatesMeSDélaiCDC2022?: { min: string; max: string };
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
                defaultValue: miseEnService && formatDateForInput(miseEnService),
                min: formatDateForInput(projet.dateDésignation),
                max: formatDateForInput(new Date().toISOString()),
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
                        {displayDate(new Date(intervalleDatesMeSDélaiCDC2022.min))}
                      </span>{' '}
                      et le{' '}
                      <span className="font-bold">
                        {displayDate(new Date(intervalleDatesMeSDélaiCDC2022.max))}
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
                      {displayDate(new Date(projet.dateDésignation))}
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
