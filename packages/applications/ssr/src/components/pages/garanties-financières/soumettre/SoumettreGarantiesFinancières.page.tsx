'use client';

import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { CallOut } from '@codegouvfr/react-dsfr/CallOut';

import { Routes } from '@potentiel-libraries/routes';

import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { Form } from '@/components/atoms/form/Form';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { formatDateForInput } from '@/utils/formatDateForInput';
import { PageTemplate } from '@/components/templates/Page.template';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';
import {
  TypeGarantiesFinancièresSelect,
  TypeGarantiesFinancièresSelectProps,
} from '../TypeGarantiesFinancièresSelect';

import { soumettreGarantiesFinancièresAction } from './soumettreGarantiesFinancières.action';

export type SoumettreGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  garantiesFinancièresÀTraiterExistante?: true;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
};

export const SoumettreGarantiesFinancièresPage: FC<SoumettreGarantiesFinancièresProps> = ({
  projet,
  garantiesFinancièresÀTraiterExistante,
  typesGarantiesFinancières,
}) => {
  const router = useRouter();

  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  const { identifiantProjet } = projet;

  if (garantiesFinancièresÀTraiterExistante) {
    return (
      <PageTemplate banner={<ProjetBanner {...projet} />}>
        <CallOut
          buttonProps={{
            children: 'Voir',
            linkProps: {
              href: Routes.GarantiesFinancières.modifierDépôtEnCours(identifiantProjet),
            },
          }}
          iconId="ri-information-line"
          title="Garanties financières en attente de validation"
        >
          Vous avez déjà soumis des garanties financières en attente de validation pour ce projet.
          Si vous souhaitez soumettre de nouvelles garanties financières, vous devez d'abord
          supprimer celles en attente.
        </CallOut>
      </PageTemplate>
    );
  }

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner {...projet} />}
      heading={<TitrePageGarantiesFinancières />}
      leftColumn={{
        children: (
          <Form
            method="POST"
            encType="multipart/form-data"
            action={soumettreGarantiesFinancièresAction}
            onSuccess={() =>
              router.push(Routes.GarantiesFinancières.détail(projet.identifiantProjet))
            }
            onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
          >
            <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

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
                  href: Routes.Projet.details(identifiantProjet),
                }}
                iconId="fr-icon-arrow-left-line"
              >
                Retour au détail du projet
              </Button>
              <SubmitButton>Soumettre</SubmitButton>
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
              <p className="py-4">
                Une fois les garanties financières déposées dans Potentiel, la DREAL concernée
                recevra une notification par mail l'invitant à vérifier leur conformité. Vous serez
                à votre tour notifié par mail à la validation des garanties financières.
              </p>
            }
          />
        ),
      }}
    />
  );
};
