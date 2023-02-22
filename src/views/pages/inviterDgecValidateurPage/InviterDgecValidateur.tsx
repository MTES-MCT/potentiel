import React from 'react';
import { Request } from 'express';
import routes from '@routes';
import {
  Button,
  Heading1,
  Heading2,
  Input,
  PageTemplate,
  RésultatSoumissionFormulaire,
  RésultatSoumissionFormulaireProps,
} from '@components';
import { hydrateOnClient } from '../../helpers';

type InviterDgecValidateurProps = {
  request: Request;
  résultatSoumissionFormulaire?: RésultatSoumissionFormulaireProps['résultatSoumissionFormulaire'];
};

export const InviterDgecValidateur = ({
  request,
  résultatSoumissionFormulaire,
}: InviterDgecValidateurProps) => {
  return (
    <PageTemplate user={request.user} currentPage="inviter-dgec-validateur">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Gérer les DGEC-VALIDATEUR</Heading1>
        </div>
        <div className="panel__header">
          <Heading2>Ajouter un utilisateur DGEC-VALIDATEUR</Heading2>
          {résultatSoumissionFormulaire && (
            <RésultatSoumissionFormulaire {...{ résultatSoumissionFormulaire }} />
          )}
          <form
            action={routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION}
            method="post"
            className="flex flex-col gap-4"
          >
            <p className="text-sm italic">Tous les champs sont obligatoires</p>
            <input type="hidden" name="role" value="dgec-validateur" />
            <div>
              <label htmlFor="email">Adresse email :</label>
              <Input
                type="email"
                name="email"
                id="email"
                required
                className="mb-2"
                {...(résultatSoumissionFormulaire?.type === 'échec' &&
                  résultatSoumissionFormulaire.erreursDeValidation && {
                    error: résultatSoumissionFormulaire.erreursDeValidation['email'],
                  })}
              />
              <label htmlFor="fonction">Fonction :</label>
              <Input
                type="text"
                name="fonction"
                id="fonction"
                required
                {...(résultatSoumissionFormulaire?.type === 'échec' &&
                  résultatSoumissionFormulaire.erreursDeValidation && {
                    error: résultatSoumissionFormulaire.erreursDeValidation['fonction'],
                  })}
              />
            </div>
            <Button type="submit" id="submit" className="m-auto">
              Inviter
            </Button>
          </form>
        </div>
      </div>
    </PageTemplate>
  );
};

hydrateOnClient(InviterDgecValidateur);
