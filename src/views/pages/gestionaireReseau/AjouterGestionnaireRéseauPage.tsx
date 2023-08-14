import React from 'react';
import {
  PrimaryButton,
  ErrorBox,
  FormulaireChampsObligatoireLégende,
  Heading1,
  Input,
  Label,
  Link,
  PageTemplate,
  Form,
  LabelDescription,
} from '../../components';
import { UtilisateurReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { hydrateOnClient } from '../../helpers';
import routes from '../../../routes';
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
  <PageTemplate
    user={utilisateur}
    currentPage={'liste-gestionnaires-réseau'}
    contentHeader={<div className="text-3xl">Outils</div>}
  >
    <Heading1>Ajouter un gestionnaire de réseau</Heading1>
    {erreur && <ErrorBox title={erreur} />}
    <Form method="post" action={routes.POST_AJOUTER_GESTIONNAIRE_RESEAU} className="mx-auto">
      <FormulaireChampsObligatoireLégende className="self-end" />
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

      <ChampsAideALaSaisieIdentifiant />

      <div>
        <Label htmlFor="expressionReguliere">Expression régulière</Label>
        <LabelDescription>{'Exemple : [a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6}'}</LabelDescription>
        <Input
          type="text"
          error={erreurValidation ? erreurValidation['error-body.expressionReguliere'] : undefined}
          id="expressionReguliere"
          name="expressionReguliere"
        />
      </div>

      <div className="mx-auto flex gap-4 items-center">
        <PrimaryButton type="submit">Ajouter</PrimaryButton>
        <Link href={routes.GET_LISTE_GESTIONNAIRES_RESEAU}>Retourner à la liste</Link>
      </div>
    </Form>
  </PageTemplate>
);

hydrateOnClient(AjouterGestionnaireRéseau);
