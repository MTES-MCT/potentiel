'use client';

import React, { FC, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Download from '@codegouvfr/react-dsfr/Download';
import Input from '@codegouvfr/react-dsfr/Input';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Link from 'next/link';
import Button from '@codegouvfr/react-dsfr/Button';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-libraries/routes';

import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Form } from '@/components/atoms/form/Form';
import { formatDateForInput } from '@/utils/formatDateForInput';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { TitrePageGarantiesFinancières } from '../TitrePageGarantiesFinancières';
import {
  TypeGarantiesFinancièresSelect,
  TypeGarantiesFinancièresSelectProps,
} from '../TypeGarantiesFinancièresSelect';

import { modifierGarantiesFinancièresAction } from './modifierGarantiesFinancières.action';

type GarantiesFinancières = {
  type: string;
  dateÉchéance?: string;
  dateConsitution: string;
  attestationConstitution: string;
};

export type DétailsGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  garantiesFinancieres: {
    actuelles?: GarantiesFinancières;
    dépôt?: GarantiesFinancières;
  };
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresProps> = ({
  projet,
  garantiesFinancieres: { actuelles, dépôt },
}) => {
  if (!actuelles && !dépôt) {
    return notFound();
  }

  if (actuelles) {
    return <ConsulterGarantiesFinancières projet={projet} garantiesFinancieres={actuelles} />;
  }

  if (dépôt) {
    return <ModifierGarantiesFinancières projet={projet} garantiesFinancieres={dépôt} />;
  }

  return null;
};

type ConsulterGarantiesFinancièresProps = {
  projet: DétailsGarantiesFinancièresProps['projet'];
  garantiesFinancieres: GarantiesFinancières;
};
const ConsulterGarantiesFinancières: FC<ConsulterGarantiesFinancièresProps> = ({
  projet,
  garantiesFinancieres,
}) => (
  <PageTemplate banner={<ProjetBanner {...projet} />}>
    <TitrePageGarantiesFinancières />
    <div className="flex flex-col gap-4">
      <Input
        label="Type de garanties financières"
        nativeInputProps={{
          type: 'text',
          value: garantiesFinancieres.type,
          readOnly: true,
          'aria-readonly': true,
        }}
      />

      {garantiesFinancieres.dateÉchéance && (
        <Input
          label="Date d'échéance"
          nativeInputProps={{
            type: 'date',
            value: formatDateForInput(garantiesFinancieres.dateÉchéance),
            readOnly: true,
            'aria-readonly': true,
          }}
        />
      )}

      <Input
        label="Date de constitution"
        nativeInputProps={{
          type: 'date',
          value: formatDateForInput(garantiesFinancieres.dateConsitution),
          readOnly: true,
          'aria-readonly': true,
        }}
      />

      <Download
        label="Attestation de constitution"
        details="Consulter l'attestation de constitution transmise"
        linkProps={{
          href: Routes.Document.télécharger(garantiesFinancieres.attestationConstitution),
          target: '_blank',
        }}
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
      </div>
    </div>
  </PageTemplate>
);

type ModifierGarantiesFinancièresProps = {
  projet: DétailsGarantiesFinancièresProps['projet'];
  garantiesFinancieres: GarantiesFinancières;
};

const ModifierGarantiesFinancières: FC<ModifierGarantiesFinancièresProps> = ({
  projet,
  garantiesFinancieres,
}) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner {...projet} />}
      heading={<TitrePageGarantiesFinancières />}
      leftColumn={{
        children: (
          <Form
            method="POST"
            encType="multipart/form-data"
            action={modifierGarantiesFinancièresAction}
            onSuccess={() =>
              router.push(Routes.GarantiesFinancières.détail(projet.identifiantProjet))
            }
            onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
            heading="Modifier des garanties financières"
          >
            <TypeGarantiesFinancièresSelect
              id="typeGarantiesFinancieres"
              name="typeGarantiesFinancieres"
              validationErrors={validationErrors}
              typeGarantiesFinancièresActuel={
                garantiesFinancieres.type as TypeGarantiesFinancièresSelectProps['typeGarantiesFinancièresActuel']
              }
              dateÉchéanceActuelle={garantiesFinancieres.dateÉchéance}
            />

            <Input
              label="Date de constitution"
              nativeInputProps={{
                type: 'date',
                name: 'dateConstitution',
                max: formatDateForInput(new Date().toISOString()),
                defaultValue: garantiesFinancieres.dateConsitution
                  ? formatDateForInput(garantiesFinancieres.dateConsitution)
                  : undefined,
                required: true,
                'aria-required': true,
              }}
              state={validationErrors.includes('dateConstitution') ? 'error' : 'default'}
              stateRelatedMessage="Date de constitution des garanties financières obligatoire"
            />

            <Upload
              label={
                <>
                  Attestation de constitution{' '}
                  {garantiesFinancieres.attestationConstitution && (
                    <>
                      <br />
                      <small>
                        Pour que la modification puisse fonctionner, merci de joindre un nouveau
                        fichier ou{' '}
                        <Link
                          href={Routes.Document.télécharger(
                            garantiesFinancieres.attestationConstitution,
                          )}
                          target="_blank"
                        >
                          celui préalablement transmis
                        </Link>
                      </small>
                    </>
                  )}
                </>
              }
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
                Vous pouvez modifier ce dépôt jusqu'à sa validation par la DREAL concernée.
              </p>
            }
          />
        ),
      }}
    />
  );
};
