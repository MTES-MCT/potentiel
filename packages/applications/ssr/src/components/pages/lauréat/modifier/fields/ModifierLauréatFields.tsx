/* eslint-disable react/jsx-props-no-spreading */
'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';
import { useState } from 'react';

import { ModifierCandidatureNotifiéeFormEntries } from '@/utils/zod/candidature';

export type FieldProps<T> = {
  candidature: T;
  lauréat: T;
  estEnCoursDeModification?: boolean;
  isPPE2?: boolean;
};
type ProjectFieldProps<T> = FieldProps<T> & {
  name: keyof ModifierCandidatureNotifiéeFormEntries;
} & Pick<InputProps, 'label' | 'nativeInputProps'>;
type CandidatureFieldProps<T> = {
  candidature: T;
  name: keyof ModifierCandidatureNotifiéeFormEntries;
} & Pick<InputProps, 'label'>;

export const ProjectField = <T extends string | number>({
  candidature,
  lauréat,
  label,
  name,
  estEnCoursDeModification,
  nativeInputProps,
}: ProjectFieldProps<T>) => {
  const [linked, setLinked] = useState(candidature === lauréat && !estEnCoursDeModification);
  const [candidatureValue, setCandidatureValue] = useState(candidature);
  const [lauréatValue, setLauréatValue] = useState(lauréat);

  const onButtonClick = () => {
    setLinked((l) => !l);
    setLauréatValue(candidatureValue);
  };

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">{label}</div>
      <div className="flex-1 flex ">
        <input
          name={`candidature.${name}`}
          type="hidden"
          value={candidatureValue}
          disabled={candidatureValue === candidature}
        />
        <Input
          label=""
          nativeInputProps={{
            ...nativeInputProps,
            value: candidatureValue,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value as T);
              if (linked) {
                setLauréatValue(ev.target.value as T);
              }
            },
          }}
        />
      </div>
      <div className="flex-1 flex flex-row gap-2 items-center">
        <input
          name={`laureat.${name}`}
          type="hidden"
          value={lauréatValue}
          disabled={lauréatValue === lauréat}
        />
        <Input
          disabled={estEnCoursDeModification || linked}
          label=""
          nativeInputProps={{
            ...nativeInputProps,
            value: lauréatValue,
            onChange: (ev) => {
              setLauréatValue(ev.target.value as T);
              if (linked) {
                setCandidatureValue(ev.target.value as T);
              }
            },
          }}
          addon={
            <Button
              type="button"
              iconId={linked ? 'fr-icon-lock-unlock-fill' : 'fr-icon-lock-fill'}
              title="Appliquer les changements au projet"
              onClick={onButtonClick}
              disabled={estEnCoursDeModification}
              nativeButtonProps={{ 'aria-label': 'Appliquer les changements au projet' }}
            />
          }
        />
      </div>
    </div>
  );
};

export const CandidatureField = <T extends string | number>({
  candidature,
  label,
  name,
}: CandidatureFieldProps<T>) => {
  const [candidatureValue, setCandidatureValue] = useState(candidature);

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">{label}</div>
      <div className="flex-1 flex ">
        <input
          name={`candidature.${name}`}
          type="hidden"
          value={candidatureValue}
          disabled={candidatureValue === candidature}
        />
        <Input
          label=""
          nativeInputProps={{
            value: candidatureValue,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value as T);
            },
          }}
        />
      </div>
      <div className="flex-1 flex flex-row gap-2 items-center">
        <Input
          disabled
          label=""
          nativeInputProps={{
            value: candidatureValue,
          }}
          addon={
            <Button
              type="button"
              iconId="fr-icon-lock-fill"
              title="Appliquer les changements au projet"
              disabled={true}
              nativeButtonProps={{ 'aria-label': 'Appliquer les changements au projet' }}
            />
          }
        />
      </div>
    </div>
  );
};
