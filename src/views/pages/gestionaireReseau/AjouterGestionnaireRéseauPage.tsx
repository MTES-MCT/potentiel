import React from 'react';
import {
  PrimaryButton,
  ErrorBox,
  FormulaireChampsObligatoireLégende,
  Heading1,
  Input,
  Label,
  Link,
  LegacyPageTemplate,
  Form,
} from '@components';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { hydrateOnClient } from '@views/helpers';
import routes from '@routes';
import { ChampsAideALaSaisieIdentifiant } from './components/ChampsAideALaSaisieIdentifiant';

type AjouterGestionnaireRéseauProps = {
  utilisateur: UtilisateurReadModel;
  erreur?: string;
  erreurValidation?: Record<string, string>;
};

export const AjouterGestionnaireRéseau = ({
  utilisateur,
  erreur,
  erreurValidation,
}: AjouterGestionnaireRéseauProps) => (
  <LegacyPageTemplate user={utilisateur} currentPage={'liste-gestionnaires-réseau'}>
    <Heading1>Ajouter un gestionnaire de réseau</Heading1>
    {erreur && <ErrorBox title={erreur} />}
    <Form method="post" action={routes.POST_AJOUTER_GESTIONNAIRE_RESEAU} className="mx-auto">
      <FormulaireChampsObligatoireLégende className="self-end" />
      <div>
        <Label htmlFor="raisonSociale" required>
          Raison sociale
        </Label>
        <Input
          type="text"
          error={erreurValidation ? erreurValidation['error-body.raisonSociale'] : undefined}
          id="raisonSociale"
          name="raisonSociale"
          required
        />
      </div>
      <div>
        <Label htmlFor="codeEIC" required>
          Code EIC
        </Label>
        <Input
          type="text"
          error={erreurValidation ? erreurValidation['error-body.codeEIC'] : undefined}
          id="codeEIC"
          name="codeEIC"
          required
        />
      </div>
      <ChampsAideALaSaisieIdentifiant />
      <div className="mx-auto flex gap-4 items-center">
        <PrimaryButton type="submit">Ajouter</PrimaryButton>
        <Link href={routes.GET_LISTE_GESTIONNAIRES_RESEAU}>Retourner à la liste</Link>
      </div>
    </Form>
  </LegacyPageTemplate>
);

hydrateOnClient(AjouterGestionnaireRéseau);
