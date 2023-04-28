import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  Button,
  Callout,
  ErrorBox,
  Heading2,
  InfoBox,
  Label,
  Link,
  PageProjetTemplate,
  PlugIcon,
  Select,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import routes from '@routes';
import { GestionnaireRéseauReadModel, RésuméProjetReadModel } from '@potentiel/domain';

type ModifierGestionnaireRéseauProjetProps = {
  user: UtilisateurReadModel;
  résuméProjet: RésuméProjetReadModel;
  reference: string;
  error?: string;
  identifiantProjet: string;
  gestionnaireActuel: GestionnaireRéseauReadModel;
  listeGestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
};

export const ModifierGestionnaireRéseauProjet = ({
  user,
  résuméProjet,
  reference,
  error,
  identifiantProjet,
  gestionnaireActuel,
  listeGestionnairesRéseau,
}: ModifierGestionnaireRéseauProjetProps) => {
  const handleGestionnaireSéléctionné = (codeEIC: string) => {
    const gestionnaireSélectionné = listeGestionnairesRéseau?.find(
      (gestionnaire) => gestionnaire.codeEIC === codeEIC,
    );
  };
  return (
    <PageProjetTemplate
      titre={
        <>
          <PlugIcon className="mr-1" />
          Raccordement
        </>
      }
      user={user}
      résuméProjet={résuméProjet}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <form
          className="flex gap-3 flex-col max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_MODIFIER_GESTIONNAIRE_RESEAU_PROJET(identifiantProjet, reference)}
        >
          {error && <ErrorBox>{error}</ErrorBox>}
          <Heading2 className="mb-0">Modifier le gestionnaire de réseau du projet</Heading2>

          <Callout className="text-sm my-4 px-3 pt-1 pb-0">
            <p>Gestionnaire de réseau actuel: {gestionnaireActuel}</p>
          </Callout>

          <div>
            <Label htmlFor="codeEIC">Gestionnaire de réseau</Label>
            <Select
              id="codeEIC"
              name="codeEIC"
              onChange={(e) => handleGestionnaireSéléctionné(e.currentTarget.value)}
              defaultValue={'none'}
            >
              <option value="none" disabled hidden>
                Sélectionnez votre gestionnaire de réseau
              </option>
              {listeGestionnairesRéseau.map(({ codeEIC, raisonSociale }) => (
                <option value={codeEIC} key={codeEIC}>
                  {raisonSociale} (code EIC : {codeEIC})
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <Button type="submit">Transmettre</Button>
            <Link href={routes.PROJECT_DETAILS(identifiantProjet)} className="m-auto">
              Retour vers le projet
            </Link>
          </div>
        </form>

        <InfoBox className="flex md:w-1/3 md:mx-auto" title="Concernant le dépôt">
          Le dépôt est informatif, il ne remplace pas la transmission à votre gestionnaire.
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};
hydrateOnClient(ModifierGestionnaireRéseauProjet);
