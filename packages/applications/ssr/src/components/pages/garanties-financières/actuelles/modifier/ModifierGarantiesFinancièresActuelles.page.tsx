'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { now } from '@potentiel-libraries/iso8601-datetime';

import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { PageTemplate } from '@/components/templates/Page.template';
import { InputDate } from '@/components/atoms/form/InputDate';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';
import {
  TypeGarantiesFinancièresSelect,
  TypeGarantiesFinancièresSelectProps,
} from '../../TypeGarantiesFinancièresSelect';
import { GarantiesFinancièresActuelles } from '../../détails/components/GarantiesFinancièresActuelles';

import { modifierGarantiesFinancièresActuellesAction } from './modifierGarantiesFinancièresActuelles.action';

export type ModifierGarantiesFinancièresActuellesProps = {
  projet: ProjetBannerProps;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
  actuelles: GarantiesFinancièresActuelles;
};

export const ModifierGarantiesFinancièresActuellesPage: FC<
  ModifierGarantiesFinancièresActuellesProps
> = ({ projet, typesGarantiesFinancières, actuelles }) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      <TitrePageGarantiesFinancières title="Modifier les garanties financières actuelles" />
      <Form
        method="POST"
        encType="multipart/form-data"
        action={modifierGarantiesFinancièresActuellesAction}
        onSuccess={() => router.push(Routes.GarantiesFinancières.détail(projet.identifiantProjet))}
        onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      >
        <input type="hidden" name="identifiantProjet" value={projet.identifiantProjet} />

        <TypeGarantiesFinancièresSelect
          id="type"
          name="type"
          validationErrors={validationErrors}
          typesGarantiesFinancières={typesGarantiesFinancières}
          typeGarantiesFinancièresActuel={
            actuelles.type as TypeGarantiesFinancièresSelectProps['typeGarantiesFinancièresActuel']
          }
          dateÉchéanceActuelle={actuelles.dateÉchéance}
        />

        <InputDate
          label="Date de constitution"
          nativeInputProps={{
            type: 'date',
            name: 'dateConstitution',
            max: now(),
            defaultValue: actuelles.dateConstitution,
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
              {actuelles.attestation && (
                <>
                  <br />
                  <small>
                    Pour que la modification puisse fonctionner, merci de joindre un nouveau fichier
                    ou{' '}
                    <Link href={Routes.Document.télécharger(actuelles.attestation)} target="_blank">
                      celui préalablement transmis
                    </Link>
                  </small>
                </>
              )}
            </>
          }
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
              href: Routes.GarantiesFinancières.détail(projet.identifiantProjet),
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour au détail des garanties financières
          </Button>
          <SubmitButton>Modifier</SubmitButton>
        </div>
      </Form>
    </PageTemplate>
  );
};
