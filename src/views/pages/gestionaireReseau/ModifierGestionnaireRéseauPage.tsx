import React from 'react';
import {
  PrimaryButton,
  FormulaireChampsObligatoireLégende,
  Heading1,
  Input,
  Label,
  Link,
  Form,
  PageTemplate,
  LabelDescription,
} from '@components';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { hydrateOnClient } from '@views/helpers';
import { GestionnaireRéseauReadModel } from '@potentiel/domain';
import routes from '@routes';
import { ChampsAideALaSaisieIdentifiant } from './components/ChampsAideALaSaisieIdentifiant';

type ModifierGestionnaireRéseauProps = {
  utilisateur: UtilisateurReadModel;
  gestionnaireRéseau: GestionnaireRéseauReadModel;
  erreurValidation?: Record<string, string>;
};

export const ModifierGestionnaireRéseau = ({
  utilisateur,
  gestionnaireRéseau: {
    raisonSociale,
    codeEIC,
    aideSaisieRéférenceDossierRaccordement: { format, légende },
    expressionReguliere = '',
  },
  erreurValidation,
}: ModifierGestionnaireRéseauProps) => (
  <PageTemplate
    user={utilisateur}
    currentPage={'liste-gestionnaires-réseau'}
    contentHeader={<div className="text-3xl">Outils</div>}
  >
    <Heading1>Modifier le gestionnaire de réseau ({raisonSociale})</Heading1>
    <Form
      method="post"
      action={routes.POST_MODIFIER_GESTIONNAIRE_RESEAU(codeEIC)}
      className="mx-auto"
    >
      <FormulaireChampsObligatoireLégende className="self-end" />

      <div>
        <Label htmlFor="codeEIC">Code EIC</Label>
        <Input type="text" id="codeEIC" name="codeEIC" defaultValue={codeEIC} disabled />
      </div>

      <div>
        <Label htmlFor="raisonSociale" required>
          Raison sociale
        </Label>
        <Input
          type="text"
          id="raisonSociale"
          name="raisonSociale"
          defaultValue={raisonSociale}
          required
          error={erreurValidation ? erreurValidation['error-body.raisonSociale'] : undefined}
        />
      </div>

      <ChampsAideALaSaisieIdentifiant format={format} légende={légende} />

      <div>
        <Label htmlFor="expressionReguliere">Expression régulière</Label>
        <LabelDescription>{'Exemple : [a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6}'}</LabelDescription>
        <Input
          type="text"
          error={erreurValidation ? erreurValidation['error-body.expressionReguliere'] : undefined}
          id="expressionReguliere"
          name="expressionReguliere"
          defaultValue={expressionReguliere}
        />
      </div>

      <div className="mx-auto flex flex-col md:flex-row gap-4 items-center">
        <PrimaryButton type="submit">Enregistrer</PrimaryButton>
        <Link href={routes.GET_LISTE_GESTIONNAIRES_RESEAU}>Retourner à la liste</Link>
      </div>
    </Form>
  </PageTemplate>
);

hydrateOnClient(ModifierGestionnaireRéseau);
