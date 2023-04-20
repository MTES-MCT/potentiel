import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  Button,
  ErrorBox,
  Heading1,
  Heading2,
  InfoBox,
  Input,
  Label,
  Link,
  PageProjetTemplate,
  PlugIcon,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import routes from '@routes';
import { RésuméProjetReadModel } from '@potentiel/domain';

type TransmettrePropositionTechniqueEtFinancièreProps = {
  user: UtilisateurReadModel;
  résuméProjet: RésuméProjetReadModel;
  reference: string;
  error?: string;
  identifiantProjet: string;
};

export const TransmettrePropositionTechniqueEtFinancière = ({
  user,
  résuméProjet,
  reference,
  error,
  identifiantProjet,
}: TransmettrePropositionTechniqueEtFinancièreProps) => {
  return (
    <PageProjetTemplate user={user} résuméProjet={résuméProjet}>
      <Heading1>
        <PlugIcon className="mr-1" />
        Raccordement
      </Heading1>
      <div className="flex flex-col md:flex-row gap-4">
        <form
          className="flex gap-3 flex-col max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE(
            identifiantProjet,
            reference,
          )}
        >
          {error && <ErrorBox>{error}</ErrorBox>}
          <Heading2>Transmettre la proposition technique et financière</Heading2>

          <p className="text-sm italic m-0">Tous les champs sont obligatoires</p>

          <div>
            <Label htmlFor="file">Proposition technique et financière signée</Label>
            <Input type="file" id="file" name="file" required />
          </div>
          <div>
            <Label htmlFor="dateSignature">Date de signature</Label>
            <Input type="date" id="dateSignature" name="dateSignature" required />
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
hydrateOnClient(TransmettrePropositionTechniqueEtFinancière);
