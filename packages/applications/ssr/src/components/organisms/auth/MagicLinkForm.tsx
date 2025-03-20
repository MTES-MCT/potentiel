'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import { useState } from 'react';

export const MagicLinkForm = ({ onSubmit }: { onSubmit: (email: string) => void }) => {
  const [email, setEmail] = useState('');
  return (
    <form action="javascript:void(0);" onSubmit={() => onSubmit(email)}>
      <Input
        label=""
        nativeInputProps={{
          placeholder: 'Adresse email',
          type: 'email',
          name: 'email',
          required: true,
          onChange: (e) => setEmail(e.target.value),
        }}
      />
      <Button type="submit" className="mx-auto">
        Envoyer le lien magique
      </Button>
    </form>
  );
};
