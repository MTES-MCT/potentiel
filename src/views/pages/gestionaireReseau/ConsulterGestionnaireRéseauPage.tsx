import React from 'react';
import {
  PrimaryButton,
  FormulaireChampsObligatoireLégende,
  Heading1,
  Input,
  Label,
  Link,
  LegacyPageTemplate,
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
    <div className="panel">
      <div className="panel__header">
        <Heading1>Gestionnaire de réseau ({raisonSociale})</Heading1>
      </div>
      <form method="post" action={routes.POST_MODIFIER_GESTIONNAIRE_RESEAU(codeEIC)}>
        <div className="flex gap-4 flex-col">
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
        </div>
        <PrimaryButton type="submit" className="mt-4 mr-3">
          Enregistrer
        </PrimaryButton>
        <Link href={routes.GET_LISTE_GESTIONNAIRES_RESEAU}>Retourner à la liste</Link>
      </form>
    </div>
  </LegacyPageTemplate>
);

hydrateOnClient(ConsulterGestionnaireRéseau);
