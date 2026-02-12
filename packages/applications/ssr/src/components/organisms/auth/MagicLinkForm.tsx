import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import { createModal } from '@codegouvfr/react-dsfr/Modal';

type MagicLinkFormProps = {
  onSubmit: (email: string) => void;
};

export const MagicLinkForm: FC<MagicLinkFormProps> = ({ onSubmit }) => {
  const modal = createModal({
    id: `form-modal-email-not-available`,
    isOpenedByDefault: false,
  });

  const [email, setEmail] = useState('');

  return (
    <>
      <modal.Component title="Vous êtes agent ?">
        <div className="flex flex-col mt-4 gap-5">
          <p>
            En tant qu'agent vous ne pouvez pas vous connecter à l'aide d'un lien magique.
            Veuillez-vous connecter avec ProConnect.
          </p>
        </div>
      </modal.Component>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (email.endsWith('@developpement-durable.gouv.fr')) {
            modal.open();
          } else {
            onSubmit(email);
          }
        }}
      >
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
    </>
  );
};
