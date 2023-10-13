import React from 'react';
import {
  PrimaryButton,
  Heading1,
  Input,
  Label,
  Link,
  Form,
  PageTemplate,
  LabelDescription,
} from '@potentiel/ui';
import { ChampsObligatoiresLégende } from '../../components';
import { UtilisateurReadModel , convertirEnUtilisateurLegacyReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { hydrateOnClient } from '../../helpers';
import { GestionnaireRéseauReadModel } from '@potentiel/domain-views';
import routes from '../../../routes';
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
    aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
  },
  erreurValidation,
}: ModifierGestionnaireRéseauProps) => (
  <PageTemplate
    user={convertirEnUtilisateurLegacyReadModel(utilisateur)}
    currentPage={'liste-gestionnaires-réseau'}
    contentHeader={<div className="text-3xl">Outils</div>}
  >
    <Heading1>Modifier le gestionnaire de réseau ({raisonSociale})</Heading1>
    <Form
      method="post"
      action={routes.POST_MODIFIER_GESTIONNAIRE_RESEAU(codeEIC)}
      className="mx-auto"
    >
      <ChampsObligatoiresLégende />

      <div>
        <Label htmlFor="codeEIC">Code EIC ou gestionnaire</Label>
        <Input type="text" id="codeEIC" name="codeEIC" defaultValue={codeEIC} disabled />
      </div>

      <div>
        <Label htmlFor="raisonSociale">Raison sociale</Label>
        <Input
          type="text"
          id="raisonSociale"
          name="raisonSociale"
          defaultValue={raisonSociale}
          error={erreurValidation ? erreurValidation['error-body.raisonSociale'] : undefined}
          required
          aria-required="true"
        />
      </div>

      <ChampsAideALaSaisieIdentifiant format={format} légende={légende} />

      <div>
        <Label htmlFor="expressionReguliere" optionnel>
          Expression régulière
        </Label>
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
