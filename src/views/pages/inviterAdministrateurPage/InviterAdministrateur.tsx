import React from 'react';
import { Request } from 'express';
import routes from '../../../routes';
import {
  PrimaryButton,
  Heading1,
  Input,
  Label,
  LegacyPageTemplate,
  SuccessBox,
  Form,
  ChampsObligatoiresLégende,
  ErrorBox,
} from '../../components';
import { hydrateOnClient } from '../../helpers';

type InviterAdministrateurProps = {
  request: Request;
  validationErrors?: Array<{ [fieldName: string]: string }>;
};

export const InviterAdministrateur = ({
  request,
  validationErrors,
}: InviterAdministrateurProps) => {
  const { success, error } = (request.query as any) || {};
  return (
    <LegacyPageTemplate user={request.user} currentPage="inviter-administrateur">
      <Heading1>Ajouter un utilisateur ADMINISTRATEUR</Heading1>
      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}

      <Form
        action={routes.POST_INVITER_UTILISATEUR_ADMINISTRATEUR}
        method="post"
        className="mx-auto"
      >
        <ChampsObligatoiresLégende />
        <input type="hidden" name="role" value="admin" />
        <div>
          <Label htmlFor="email">Adresse email :</Label>
          <Input
            type="email"
            name="email"
            id="email"
            className="mb-2"
            {...(validationErrors && { error: validationErrors['email']?.toString() })}
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

hydrateOnClient(InviterAdministrateur);
