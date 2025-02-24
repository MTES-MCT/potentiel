/* eslint-disable react/jsx-props-no-spreading */
'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';
import { useState } from 'react';
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip';

import { ModifierCandidatureNotifiéeFormEntries } from '@/utils/zod/candidature';

export type FieldProps<T> = {
  candidature: T;
  lauréat: T;
  name: keyof ModifierCandidatureNotifiéeFormEntries;
  estEnCoursDeModification?: boolean;
  isPPE2?: boolean;
};
type ProjectFieldProps<T> = FieldProps<T> & Pick<InputProps, 'label' | 'nativeInputProps'>;
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
      <div className="flex-[2] flex px-2">
        <input
          name={`candidature.${name}`}
          type="hidden"
          value={candidatureValue}
          disabled={candidatureValue === candidature}
        />
        <Input
          className="w-full"
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
      <div className="flex-[2] flex px-2">
        <input
          name={`laureat.${name}`}
          type="hidden"
          value={lauréatValue}
          disabled={lauréatValue === lauréat}
        />
        <Input
          className="w-full"
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
            <LinkedValuesButton
              linked={linked}
              estEnCoursDeModification={estEnCoursDeModification}
              onButtonClick={onButtonClick}
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
      <div className="flex-[2] flex px-2">
        <input
          name={`candidature.${name}`}
          type="hidden"
          value={candidatureValue}
          disabled={candidatureValue === candidature}
        />
        <Input
          className="w-full"
          label=""
          nativeInputProps={{
            value: candidatureValue,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value as T);
            },
          }}
        />
      </div>
      <div className="flex-[2] flex px-2">
        <Input
          className="w-full"
          disabled
          label=""
          nativeInputProps={{
            value: candidatureValue,
          }}
          addon={<LinkedValuesButton isLocked />}
        />
      </div>
    </div>
  );
};

type ButtonProps = {
  isLocked?: boolean;
  linked?: boolean;
  onButtonClick?: () => void;
  estEnCoursDeModification?: boolean;
};

export const LinkedValuesButton = ({
  isLocked,
  linked,
  onButtonClick,
  estEnCoursDeModification,
}: ButtonProps) => {
  const label = isLocked
    ? 'La valeur sera automatiquement appliquée au projet'
    : linked
      ? 'Ne pas appliquer les changements au projet'
      : 'Appliquer les changements au projet';

  return (
    <Tooltip kind="hover" title={label}>
      <Button
        type="button"
        iconId={linked ? 'fr-icon-lock-fill' : 'fr-icon-lock-unlock-fill'}
        title=""
        onClick={onButtonClick}
        disabled={estEnCoursDeModification || isLocked}
        nativeButtonProps={{
          'aria-label': label,
        }}
      />
    </Tooltip>
  );
};
