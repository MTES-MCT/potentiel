import {
  FormForProjetPageTemplate,
  FormForProjetPageTemplateProps,
} from '@/components/templates/FormForProjetPageTemplate';
import React from 'react';
import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import { Form } from '@/components/atoms/form/Form';
import { displayDate } from '@/utils/displayDate';

import { Routes } from '@potentiel-libraries/routes';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import Link from 'next/link';
import Input from '@codegouvfr/react-dsfr/Input';
import { transmettreDateMiseEnServiceAction } from './transmettreDateMiseEnService.action';
import { useRouter } from 'next/navigation';
import { formatDateForInput } from '@/utils/formatDateForInput';

type TransmettreDateMiseEnServiceProps = {
  projet: FormForProjetPageTemplateProps['projet'];
  dossierRaccordement: {
    référence: string;
    miseEnService?: string;
  };
  intervalleDatesMeSDélaiCDC2022: { min: Date; max: Date };
};

export const TransmettreDateMiseEnServicePage = ({
  projet,
  dossierRaccordement: { référence, miseEnService },
  intervalleDatesMeSDélaiCDC2022,
}: TransmettreDateMiseEnServiceProps) => {
  const router = useRouter();
  const { identifiantProjet, dateDésignation } = projet;

  return (
    <FormForProjetPageTemplate
      heading={<TitrePageRaccordement />}
      projet={projet}
      form={
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
              max: new Date().toISOString().split('T').shift(),
              required: true,
              'aria-required': true,
            }}
          />

          <div className="flex flex-col md:flex-row gap-4 md:mt-4">
            <SubmitButton>Transmettre</SubmitButton>
            <Link href={Routes.Raccordement.détail(identifiantProjet)} className="m-auto">
              Retour vers le dossier de raccordement
            </Link>
          </div>
        </Form>
      }
      information={{
        description: (
          <>
            <ul className="flex flex-col gap-3">
              <li>
                Si le projet{' '}
                <span className="font-bold">
                  a bénéficié du délai supplémentaire relatif du cahier des charges du 30/08/2022
                </span>
                , la saisie d'une date de mise en service non comprise entre le{' '}
                <span className="font-bold">
                  {displayDate(new Date(intervalleDatesMeSDélaiCDC2022.min))}
                </span>{' '}
                et le{' '}
                <span className="font-bold">
                  {displayDate(new Date(intervalleDatesMeSDélaiCDC2022.max))}
                </span>{' '}
                peut remettre en cause l'application de ce délai et entraîner une modification de la
                date d'achèvement du projet.
              </li>
              <li>
                Si le projet{' '}
                <span className="font-bold">
                  n'a pas bénéficié du délai supplémentaire relatif du cahier des charges du
                  30/08/2022
                </span>
                , la saisie d'une date de mise en service doit être comprise entre la date de
                désignation du projet (
                <span className="font-bold">{displayDate(new Date(projet.dateDésignation))}</span>)
                et <span className="font-bold">ce jour</span>.
              </li>
            </ul>
          </>
        ),
      }}
    />
  );
};
