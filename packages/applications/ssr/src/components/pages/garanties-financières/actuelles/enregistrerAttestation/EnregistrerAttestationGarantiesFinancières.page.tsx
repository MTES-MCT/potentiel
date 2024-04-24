'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { Upload } from '@codegouvfr/react-dsfr/Upload';

import { Routes } from '@potentiel-applications/routes';
import { now } from '@potentiel-libraries/iso8601-datetime';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputDate } from '@/components/atoms/form/InputDate';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';

import { enregistrerAttestationGarantiesFinancièresAction } from './enregistrerAttestationGarantiesFinancières.action';

export type EnregistrerAttestationGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
};

export const EnregistrerAttestationGarantiesFinancièresPage: FC<
  EnregistrerAttestationGarantiesFinancièresProps
> = ({ projet }) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      <TitrePageGarantiesFinancières title="Enregistrer l'attestation de constitution" />
      <Form
        method="POST"
        encType="multipart/form-data"
        action={enregistrerAttestationGarantiesFinancièresAction}
        onSuccess={() => router.push(Routes.GarantiesFinancières.détail(projet.identifiantProjet))}
        onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
        buttons={
          <>
            <Button
              priority="secondary"
              linkProps={{
                href: Routes.GarantiesFinancières.détail(projet.identifiantProjet),
              }}
              iconId="fr-icon-arrow-left-line"
            >
              Retour au détail des garanties financières
            </Button>
            <SubmitButton>Enregistrer</SubmitButton>
          </>
        }
      >
        <input type="hidden" name="identifiantProjet" value={projet.identifiantProjet} />

        <InputDate
          label="Date de constitution"
          nativeInputProps={{
            type: 'date',
            name: 'dateConstitution',
            max: now(),
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
          stateRelatedMessage="Attestation de constitution des garantières financières obligatoire"
        />
      </Form>
    </PageTemplate>
  );
};
