import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  PrimaryButton,
  ErrorBox,
  Heading2,
  InfoBox,
  Input,
  Label,
  Link,
  PageProjetTemplate,
  Form,
} from '@components';
import { hydrateOnClient } from '../../../helpers';
import routes from '@routes';
import { ConsulterProjetReadModel, DossierRaccordementReadModel } from '@potentiel/domain-views';
import { TitrePageRaccordement } from '../components/TitrePageRaccordement';

type TransmettrePropositionTechniqueEtFinancièreProps = {
  user: UtilisateurReadModel;
  projet: ConsulterProjetReadModel;
  dossierRaccordement: DossierRaccordementReadModel;
  error?: string;
};

export const TransmettrePropositionTechniqueEtFinancière = ({
  user,
  projet,
  dossierRaccordement: { référence },
  error,
}: TransmettrePropositionTechniqueEtFinancièreProps) => {
  const { identifiantProjet } = projet;

  return (
    <PageProjetTemplate titre={<TitrePageRaccordement />} user={user} résuméProjet={projet}>
      <p className="my-2 p-0">Référence du dossier de raccordement : {référence}</p>
      <div className="flex flex-col md:flex-row gap-4">
        <Form
          className="flex gap-3 flex-col max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE(
            identifiantProjet,
            référence,
          )}
        >
          {error && <ErrorBox>{error}</ErrorBox>}
          <Heading2 className="mb-0">Transmettre la proposition technique et financière</Heading2>

          <p className="text-sm italic m-0">Tous les champs sont obligatoires</p>

          <div>
            <Label htmlFor="file">Proposition technique et financière signée</Label>
            <Input type="file" id="file" name="file" required />
          </div>
          <div>
            <Label htmlFor="dateSignature">Date de signature</Label>
            <Input
              type="date"
              id="dateSignature"
              name="dateSignature"
              max={new Date().toISOString().split('T').shift()}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <PrimaryButton type="submit">Transmettre</PrimaryButton>
            <Link
              href={routes.GET_LISTE_DOSSIERS_RACCORDEMENT(identifiantProjet)}
              className="m-auto"
            >
              Retour vers le dossier de raccordement
            </Link>
          </div>
        </Form>

        <InfoBox className="flex md:w-1/3 md:mx-auto" title="Concernant le dépôt">
          Le dépôt est informatif, il ne remplace pas la transmission à votre gestionnaire.
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};
hydrateOnClient(TransmettrePropositionTechniqueEtFinancière);
