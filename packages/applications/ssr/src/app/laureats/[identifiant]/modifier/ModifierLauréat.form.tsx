/* eslint-disable react/jsx-props-no-spreading */
'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';
import React, { useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { Heading3 } from '@/components/atoms/headings';

const FormRow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-row items-center gap-4 mt-4">{children}</div>
);

type FieldProps<T> = { candidature: T; current: T; disabled?: boolean; label?: string };

const PuissanceField = ({ candidature, current, disabled, label }: FieldProps<number>) => {
  const [linked, setLinked] = useState(candidature === current);
  const [candidatureValue, setCandidatureValue] = useState(candidature);
  const [currentValue, setCurrentValue] = useState(current);

  const props: InputProps = {
    state: 'default',
    stateRelatedMessage: '',
    label: '',
    nativeInputProps: {
      required: true,
      'aria-required': true,
      type: 'number',
      step: 0.1,
    },
    className: 'max-w-28',
  };
  return (
    <>
      <div className="flex-1 font-semibold">Puissance ({label})</div>
      <div className="flex-1">
        <Input
          {...props}
          nativeInputProps={{
            ...props.nativeInputProps,
            value: candidatureValue,
            onChange: (ev) => {
              setCandidatureValue(Number(ev.target.value));
              if (linked) {
                setCurrentValue(Number(ev.target.value));
              }
            },
          }}
        />
      </div>
      <div className="flex-1 flex flex-row align-center">
        <Button
          iconId={linked ? 'fr-icon-link' : 'fr-icon-link-unlink'}
          title="Appliquer les changements au projet"
          size="small"
          className="mt-3 mr-2 "
          onClick={() => setLinked((l) => !l)}
          disabled={candidature != current}
        />
        <Input
          {...props}
          nativeInputProps={{
            ...props.nativeInputProps,
            value: currentValue,
            onChange: (ev) => {
              setCurrentValue(Number(ev.target.value));
            },
          }}
          disabled={disabled || linked}
        />
      </div>
    </>
  );
};
const TechnologieField = ({ candidature, current }: FieldProps<string>) => {
  const [linked, setLinked] = useState(candidature === current);
  const [candidatureValue, setCandidatureValue] = useState(candidature);
  const [currentValue, setCurrentValue] = useState(current);
  const props = {
    state: 'default' as const,
    stateRelatedMessage: '',
    label: '',
    options: [
      { label: 'Eolien', value: 'eolien' },
      { label: 'Solaire', value: 'solaire' },
    ],
    nativeSelectProps: {
      defaultValue: 1.1,
      required: true,
      'aria-required': true,
    },
    className: 'max-w-28',
  };
  return (
    <>
      <div className="flex-1 font-semibold">Technologie</div>
      <div className="flex-1">
        <Select
          {...props}
          nativeSelectProps={{
            ...props.nativeSelectProps,
            value: candidatureValue,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value);
              if (linked) {
                setCurrentValue(ev.target.value);
              }
            },
          }}
        />
      </div>
      <div className="flex-1 flex flex-row align-center">
        <Button
          iconId={linked ? 'fr-icon-link' : 'fr-icon-link-unlink'}
          title="Appliquer les changements au projet"
          size="small"
          className="mt-3 mr-2 "
          onClick={() => setLinked((l) => !l)}
          disabled={candidature != current}
        />
        <Select
          {...props}
          nativeSelectProps={{
            ...props.nativeSelectProps,
            value: currentValue,
            onChange: (ev) => {
              setCurrentValue(ev.target.value);
            },
          }}
          disabled={linked}
        />
      </div>
    </>
  );
};

export const ModifierLauréatForm = () => (
  <>
    <div className="flex flex-col gap-4 mt-4">
      <FormRow>
        <div className="flex-1">
          <Heading3>Champs à modifier</Heading3>
        </div>
        <div className="flex-1">
          <Heading3>Valeur à la candidature</Heading3>
        </div>
        <div className="flex-1">
          <Heading3>Valeur actuelle</Heading3>
        </div>
      </FormRow>
      <FormRow>
        <TechnologieField candidature="eolien" current="eolien" />
      </FormRow>
      <FormRow>
        <PuissanceField label="Cas non modifié" candidature={1.1} current={1.1} />
      </FormRow>
      <FormRow>
        <PuissanceField label="Cas modifié" candidature={1.1} current={1.2} />
      </FormRow>
      <FormRow>
        <PuissanceField label="Cas demande en cours" candidature={1.1} current={1.2} disabled />
      </FormRow>
      <Button className="mt-4">Appliquer les changements</Button>
    </div>
  </>
);
