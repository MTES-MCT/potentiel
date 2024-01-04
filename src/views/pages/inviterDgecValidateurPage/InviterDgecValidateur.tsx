import React from 'react';
import { Request } from 'express';
import {
  PrimaryButton,
  Heading1,
  Input,
  Label,
  LegacyPageTemplate,
  SuccessBox,
  Form,
  ChampsObligatoiresLégende,
} from '../../components';
import { hydrateOnClient } from '../../helpers';
import { POST_INVITER_DGEC_VALIDATEUR } from '@potentiel/legacy-routes';

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
      <Heading1>Ajouter un utilisateur DGEC-VALIDATEUR</Heading1>
      {inviationRéussi && <SuccessBox title="L'invitation a bien été envoyée" />}

      <Form action={POST_INVITER_DGEC_VALIDATEUR} method="post" className="mx-auto mt-8">
        <ChampsObligatoiresLégende />
        <input type="hidden" name="role" value="dgec-validateur" />
        <div>
          <Label htmlFor="email">Adresse email :</Label>
          <Input
            type="email"
            name="email"
            id="email"
            className="mb-2"
            error={formErrors['email']}
            required
            aria-required="true"
          />
          <Label htmlFor="fonction">Fonction :</Label>
          <Input
            type="text"
            name="fonction"
            id="fonction"
            error={formErrors['fonction']}
            required
            aria-required="true"
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
