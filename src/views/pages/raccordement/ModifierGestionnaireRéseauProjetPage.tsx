import React from 'react';

import { UtilisateurReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  PrimaryButton,
  ErrorBox,
  Heading2,
  InfoBox,
  Link,
  PageProjetTemplate,
  PlugIcon,
  Form,
  Label,
} from '../../components';
import { hydrateOnClient } from '../../helpers';
import {
  GestionnaireRéseauReadModel,
  CandidatureLegacyReadModel,
  GestionnaireRéseauLauréatReadModel,
} from '@potentiel/domain-views';
import routes from '../../../routes';
import { GestionnaireRéseauSelect } from './components/GestionnaireRéseauSelect';
import { POST_MODIFIER_GESTIONNAIRE_RESEAU_PROJET } from '@potentiel/legacy-routes';

type ModifierGestionnaireRéseauProjetProps = {
  user: UtilisateurReadModel;
  projet: CandidatureLegacyReadModel;
  gestionnaireRéseauLauréat: GestionnaireRéseauLauréatReadModel;
  error?: string;
  listeGestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
};

export const ModifierGestionnaireRéseauProjet = ({
  user,
  projet,
  gestionnaireRéseauLauréat,
  error,
  listeGestionnairesRéseau,
}: ModifierGestionnaireRéseauProjetProps) => {
  const { identifiantProjet } = projet;
  const gestionnaireActuel = listeGestionnairesRéseau.find(
    (gestionnaire) =>
      gestionnaire.codeEIC === gestionnaireRéseauLauréat.identifiantGestionnaire?.codeEIC,
  );

  return (
    <PageProjetTemplate
      titre={
        <>
          <PlugIcon className="mr-1" />
          Raccordement
        </>
      }
      user={user}
      résuméProjet={projet}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <Form
          className="flex gap-3 flex-col max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          action={POST_MODIFIER_GESTIONNAIRE_RESEAU_PROJET(identifiantProjet)}
        >
          {error && <ErrorBox>{error}</ErrorBox>}
          <Heading2 className="mb-0">Modifier le gestionnaire de réseau du projet</Heading2>

          <div>
            <Label htmlFor="identifiantGestionnaireRéseau">Gestionnaire de réseau</Label>
            <GestionnaireRéseauSelect
              id="identifiantGestionnaireRéseau"
              name="identifiantGestionnaireRéseau"
              gestionnairesRéseau={listeGestionnairesRéseau}
              gestionnaireRéseauActuel={gestionnaireActuel}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <PrimaryButton type="submit">Modifier</PrimaryButton>
            <Link
              href={routes.GET_LISTE_DOSSIERS_RACCORDEMENT(identifiantProjet)}
              className="m-auto"
            >
              Retour vers le dossier de raccordement
            </Link>
          </div>
        </Form>

        <InfoBox className="flex md:w-1/3 md:mx-auto" title="Concernant la modification">
          La modification de cette information sera appliquée sur tous les dossiers de raccordements
          du projet.
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};
hydrateOnClient(ModifierGestionnaireRéseauProjet);
