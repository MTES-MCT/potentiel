import React from 'react';
import { Request } from 'express';
import routes from '@routes';
import {
  PrimaryButton,
  FormulaireChampsObligatoireLégende,
  Heading1,
  Heading2,
  Input,
  Label,
  LegacyPageTemplate,
  SuccessBox,
  Form,
} from '@components';
import { hydrateOnClient } from '../../helpers';

type InviterDgecValidateurProps = {
  request: Request;
  inviationRéussi?: true;
  formErrors?: Record<string, string>;
};

export const InviterDgecValidateur = ({
  request,
  inviationRéussi,
  formErrors = {},
}: InviterDgecValidateurProps) => {
  return (
    <LegacyPageTemplate user={request.user} currentPage="inviter-dgec-validateur">
      <Heading1>Gérer les DGEC-VALIDATEUR</Heading1>
      <Heading2>Ajouter un utilisateur DGEC-VALIDATEUR</Heading2>
      {inviationRéussi && <SuccessBox title="L'invitation a bien été envoyée" />}

      <Form
        action={routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION}
        method="post"
        className="flex flex-col gap-4"
      >
        <FormulaireChampsObligatoireLégende className="text-right" />
        <input type="hidden" name="role" value="dgec-validateur" />
        <div>
          <Label htmlFor="email" required>
            Adresse email :
          </Label>
          <Input
            type="email"
            name="email"
            id="email"
            required
            className="mb-2"
            error={formErrors['email']}
          />
          <Label htmlFor="fonction" required>
            Fonction :
          </Label>
          <Input
            type="text"
            name="fonction"
            id="fonction"
            required
            error={formErrors['fonction']}
          />
        </div>
        <PrimaryButton type="submit" id="submit" className="m-auto">
          Inviter
        </PrimaryButton>
      </Form>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(InviterDgecValidateur);
