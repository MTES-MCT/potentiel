'use client';

import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { initierAchèvementAction } from './initierAchèvement.action';

export type InitierAchèvementFormProps = {
  identifiantProjet: string;
};

export const InitierAchèvementForm = ({ identifiantProjet }: InitierAchèvementFormProps) => {
  const [accord, setAccord] = useState(false);

  return (
    <Form
      action={initierAchèvementAction}
      actionButtons={{
        submitLabel: `Initier`,
        submitDisabled: !accord,
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input name="identifiantProjet" type="hidden" defaultValue={identifiantProjet} />

      <Checkbox
        id="accordInitiation"
        options={[
          {
            label:
              'Je déclare avoir renseigné les données à jour concernant mon projet et celui-ci est donc prêt à initier son achèvement',
            nativeInputProps: {
              name: 'accordInitiation',
              value: 'true',
              onChange: () => setAccord(!accord),
            },
          },
        ]}
      />
    </Form>
  );
};
