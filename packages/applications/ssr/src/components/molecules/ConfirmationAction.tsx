'use client';

import Button, { ButtonProps } from '@codegouvfr/react-dsfr/Button';
import React, { useState } from 'react';
import clsx from 'clsx';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import type { formAction } from '@/utils/formAction';

export type ConfirmationActionProps = {
  id: string;
  formValues: Record<string, string>;
  action: ReturnType<typeof formAction>;
  label: string;
  confirmation: {
    title: string;
    description: React.ReactNode;
  };
  buttonProps?: ButtonProps.Common &
    (Omit<ButtonProps.WithIcon, 'children'> | Omit<ButtonProps.WithoutIcon, 'children'>);
};

export const ConfirmationAction = ({
  id,
  action,
  formValues,
  label,
  confirmation,
  buttonProps,
}: ConfirmationActionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...buttonProps}
        onClick={() => setIsOpen(true)}
        className={clsx('block w-1/2 align-center', buttonProps?.className)}
      >
        {label}
      </Button>

      <ModalWithForm
        id={`${id}-confirmation-form`}
        title={confirmation.title}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: `${id}-confirmation-modal`,
          action,
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              {typeof confirmation.description === 'string' ? (
                <p className="mt-3">{confirmation.description}</p>
              ) : (
                confirmation.description
              )}
              {Object.entries(formValues).map(([key, value]) => (
                <input key={key} type={'hidden'} value={value} name={key} />
              ))}
            </>
          ),
        }}
      />
    </>
  );
};
