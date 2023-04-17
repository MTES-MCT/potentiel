import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  Button,
  ErrorBox,
  Heading1,
  Heading2,
  Input,
  Label,
  PageTemplate,
  ProjectInfo,
  ProjectProps,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import routes from '@routes';

type TransmettrePropositionTechniqueEtFinancièreProps = {
  user: UtilisateurReadModel;
  projet: ProjectProps;
  reference: string;
  error?: string;
};

export const TransmettrePropositionTechniqueEtFinancière = ({
  user,
  projet,
  reference,
  error,
}: TransmettrePropositionTechniqueEtFinancièreProps) => {
  return (
    <PageTemplate user={user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Transmettre une proposition technique et financière</Heading1>
        </div>
        <form
          className="flex gap-3 flex-col"
          method="POST"
          action={routes.POST_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE(projet.id, reference)}
        >
          {error && <ErrorBox>{error}</ErrorBox>}
          <Heading2>Concernant le projet</Heading2>
          <ProjectInfo project={projet} className="mb-3" />
          <Heading2>Transmettre la proposition technique et financière</Heading2>
          <div>
            <Label htmlFor="dateSignature">Date de signature (champ obligatoire)</Label>
            <Input type="date" id="dateSignature" name="dateSignature" required />
          </div>
          <Button type="submit" className="m-auto">
            Envoyer
          </Button>
        </form>
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(TransmettrePropositionTechniqueEtFinancière);
