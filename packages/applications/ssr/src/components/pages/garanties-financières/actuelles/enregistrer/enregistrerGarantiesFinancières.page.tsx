'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@codegouvfr/react-dsfr/Input';
import Button from '@codegouvfr/react-dsfr/Button';
import { Upload } from '@codegouvfr/react-dsfr/Upload';

import { Routes } from '@potentiel-libraries/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { Form } from '@/components/atoms/form/Form';
import { formatDateForInput } from '@/utils/formatDateForInput';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';
import {
  TypeGarantiesFinancièresSelect,
  TypeGarantiesFinancièresSelectProps,
} from '../../TypeGarantiesFinancièresSelect';

import { enregistrerGarantiesFinancièresAction } from './enregistrerGarantiesFinancières.action';

export type EnregistrerGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
};

export const EnregistrerGarantiesFinancièresPage: FC<EnregistrerGarantiesFinancièresProps> = ({
  projet,
  typesGarantiesFinancières,
}) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      <TitrePageGarantiesFinancières title="Enregistrer des garanties financières" />
      <Form
        method="POST"
        encType="multipart/form-data"
        action={enregistrerGarantiesFinancièresAction}
        onSuccess={() => router.push(Routes.GarantiesFinancières.détail(projet.identifiantProjet))}
        onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      >
        <input name="identifiantProjet" type="hidden" value={projet.identifiantProjet} />

        <TypeGarantiesFinancièresSelect
          id="type"
          name="type"
          typesGarantiesFinancières={typesGarantiesFinancières}
          validationErrors={validationErrors}
        />

        <Input
          label="Date de constitution"
          nativeInputProps={{
            type: 'date',
            name: 'dateConstitution',
            max: formatDateForInput(new Date().toISOString()),
            required: true,
            'aria-required': true,
          }}
          state={validationErrors.includes('dateConstitution') ? 'error' : 'default'}
          stateRelatedMessage="Date de constitution des garanties financières obligatoire"
        />

        <Upload
          label="Attestation de constitution"
          hint="Format accepté : pdf"
          nativeInputProps={{
            name: 'attestation',
            required: true,
            'aria-required': true,
            accept: '.pdf',
          }}
          state={validationErrors.includes('attestation') ? 'error' : 'default'}
          stateRelatedMessage="Attestation de consitution des garantières financières obligatoire"
        />

        <div className="flex flex-col md:flex-row gap-4 mt-5">
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Projet.details(projet.identifiantProjet),
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour au détail du projet
          </Button>
          <SubmitButton>Soumettre</SubmitButton>
        </div>
      </Form>
    </PageTemplate>
  );
};
