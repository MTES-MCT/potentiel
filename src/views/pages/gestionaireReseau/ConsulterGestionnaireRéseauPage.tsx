import React from 'react';
import {
  Button,
  FormulaireChampsObligatoireLégende,
  Heading1,
  Input,
  Label,
  Link,
  PageTemplate,
} from '@components';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { hydrateOnClient } from '@views/helpers';
import { ConsulterGestionnaireRéseauReadModel } from '@modules/gestionnaireRéseau';
import routes from '@routes';
import { ChampsAideALaSaisieIdentifiant } from './components/ChampsAideALaSaisieIdentifiant';

type ConsulterGestionnaireRéseauProps = {
  utilisateur: UtilisateurReadModel;
  gestionnaireRéseau: ConsulterGestionnaireRéseauReadModel;
};

export const ConsulterGestionnaireRéseau = ({
  utilisateur,
  gestionnaireRéseau: { raisonSociale, format, légende, codeEIC },
}: ConsulterGestionnaireRéseauProps) => (
  <PageTemplate user={utilisateur} currentPage={'liste-gestionnaires-réseau'}>
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
              // error={erreurValidation ? erreurValidation['error-body.raisonSociale'] : undefined}
              id="raisonSociale"
              name="raisonSociale"
              defaultValue={raisonSociale || ''}
              required
            />
          </div>
          <ChampsAideALaSaisieIdentifiant format={format} légende={légende} />
        </div>
        <Button type="submit" className="mt-4 mr-3">
          Enregistrer
        </Button>
        <Link href={routes.GET_LISTE_GESTIONNAIRES_RESEAU}>Retourner à la liste</Link>
      </form>
    </div>
  </PageTemplate>
);

hydrateOnClient(ConsulterGestionnaireRéseau);
