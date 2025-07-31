'use client';

import { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Input from '@codegouvfr/react-dsfr/Input';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { useSearchParams } from 'next/navigation';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';

import { PlainType } from '@potentiel-domain/core';
import { Période } from '@potentiel-domain/periode';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import { importerPériodeAction, ImporterPériodeFormKeys } from './importerPériode.action';

export type ImporterPériodeFormProps = {
  périodes: PlainType<Période.ListerPériodeItemReadModel[]>;
};
export const ImporterPériodeForm: FC<ImporterPériodeFormProps> = ({ périodes }) => {
  const searchParams = useSearchParams();
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ImporterPériodeFormKeys>
  >({});
  const appelOffres = groupBy(périodes, (p) => p.identifiantPériode.appelOffre);

  const [appelOffre, setAppelOffre] = useState(
    périodes.length === 1
      ? périodes[0].identifiantPériode.appelOffre
      : (searchParams.get('appelOffre') ?? undefined),
  );
  const defaultPériode =
    appelOffre && appelOffres[appelOffre]?.length === 1
      ? périodes[0].identifiantPériode.période
      : '';

  return (
    <Form
      action={importerPériodeAction}
      heading="Importer les candidats de la période d'un appel d'offres"
      pendingModal={{
        id: 'form-import-candidatures',
        title: 'Importer des candidats',
        children: 'Import des candidats en cours ...',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={<SubmitButton>Importer</SubmitButton>}
    >
      <div className="flex justify-between">
        <Select
          label="Appel Offre"
          options={Object.keys(appelOffres).map((appelOffre) => ({
            label: appelOffre,
            value: appelOffre,
          }))}
          nativeSelectProps={{
            name: 'appelOffre',
            value: appelOffre,
            onChange: (ev) => setAppelOffre(ev.target.value),
            required: true,
          }}
          state={validationErrors['appelOffre'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['appelOffre']}
        />

        <Select
          label="Période"
          options={
            périodes
              .filter((période) => période.identifiantPériode.appelOffre == appelOffre)
              .map(({ identifiantPériode }) => ({
                label: identifiantPériode.période,
                value: identifiantPériode.période,
              }))
              .sort((a, b) => a.label.padStart(2, '0').localeCompare(b.label.padStart(2, '0'))) ??
            []
          }
          nativeSelectProps={{
            name: 'periode',
            defaultValue: defaultPériode,
            required: true,
          }}
          state={validationErrors['periode'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['periode']}
          disabled={!appelOffre}
        />
      </div>
      <Input
        label={
          <>
            Numéro de la démarche{' '}
            <Tooltip
              kind="hover"
              title={
                <>
                  Ce numéro peut-être trouvé dans l'URL de la démarche :
                  <br />
                  https://demarches.numerique.gouv.fr/admin/procedures/XXX
                </>
              }
            />
          </>
        }
        className="max-w-64"
        nativeInputProps={{
          name: 'demarcheId',
          type: 'number',
          required: true,
        }}
        state={validationErrors['demarcheId'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['demarcheId']}
      />
      <UploadNewOrModifyExistingDocument
        label="Fichier CSV d'instruction des candidatures"
        name="fichierInstruction"
        required
        formats={['csv']}
        state={validationErrors['fichierInstruction'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['fichierInstruction']}
      />
      <Checkbox
        id="test"
        options={[
          {
            label: 'Vérifier que les données sont correctes, sans import réel',
            nativeInputProps: {
              name: 'test',
              value: 'true',
              defaultChecked: true, // TODO enlever avant de merger
            },
          },
        ]}
      />
    </Form>
  );
};

/** @deprecated replace with Object.groupBy when available */
const groupBy = <K extends PropertyKey, T>(
  items: T[],
  keySelector: (item: T, index: number) => K,
): Partial<Record<K, T[]>> =>
  items.reduce(
    (result, item, index) => {
      const key = keySelector(item, index);
      result[key] ??= [];
      result[key].push(item);
      return result;
    },
    {} as Record<K, T[]>,
  );
