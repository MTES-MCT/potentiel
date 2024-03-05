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

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';

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
      <TitrePageGarantiesFinancières />
      <Form
        method="POST"
        encType="multipart/form-data"
        action={enregistrerAttestationGarantiesFinancièresAction}
        onSuccess={() => router.push(Routes.GarantiesFinancières.détail(projet.identifiantProjet))}
        onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      >
        <input type="hidden" name="identifiantProjet" value={projet.identifiantProjet} />

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
            name: 'attestationConstitution',
            required: true,
            'aria-required': true,
            accept: '.pdf',
          }}
          state={validationErrors.includes('attestationConstitution') ? 'error' : 'default'}
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
          <SubmitButton>Enregistrer</SubmitButton>
        </div>
      </Form>
    </PageTemplate>
  );
};
