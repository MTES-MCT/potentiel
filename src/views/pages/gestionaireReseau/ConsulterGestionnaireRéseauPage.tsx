import React from 'react';
import {
  PrimaryButton,
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
import { GestionnaireRéseauReadModel } from '@potentiel/domain';
import routes from '@routes';
import { ChampsAideALaSaisieIdentifiant } from './components/ChampsAideALaSaisieIdentifiant';

type ConsulterGestionnaireRéseauProps = {
  utilisateur: UtilisateurReadModel;
  gestionnaireRéseau: GestionnaireRéseauReadModel;
  erreurValidation?: Record<string, string>;
};

export const ConsulterGestionnaireRéseau = ({
  utilisateur,
  gestionnaireRéseau: {
    raisonSociale,
    codeEIC,
    aideSaisieRéférenceDossierRaccordement: { format, légende },
  },
  erreurValidation,
}: ConsulterGestionnaireRéseauProps) => (
  <LegacyPageTemplate user={utilisateur} currentPage={'liste-gestionnaires-réseau'}>
    <Heading1>Gestionnaire de réseau ({raisonSociale})</Heading1>
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
          defaultValue={raisonSociale || ''}
          required
          error={erreurValidation ? erreurValidation['error-body.raisonSociale'] : undefined}
        />
      </div>
      <ChampsAideALaSaisieIdentifiant format={format} légende={légende} />
      <div className="mx-auto flex flex-col md:flex-row gap-4 items-center">
        <PrimaryButton type="submit">Enregistrer</PrimaryButton>
        <Link href={routes.GET_LISTE_GESTIONNAIRES_RESEAU}>Retourner à la liste</Link>
      </div>
    </Form>
  </LegacyPageTemplate>
);

hydrateOnClient(ConsulterGestionnaireRéseau);
