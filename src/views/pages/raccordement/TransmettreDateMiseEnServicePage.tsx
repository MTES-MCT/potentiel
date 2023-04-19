import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  Button,
  ErrorBox,
  Heading1,
  Heading2,
  Input,
  Label,
  LegacyPageTemplate,
  ProjectInfo,
  ProjectProps,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import routes from '@routes';

type TransmettreDateMiseEnServiceProps = {
  user: UtilisateurReadModel;
  projet: ProjectProps;
  reference: string;
  error?: string;
};

export const TransmettreDateMiseEnService = ({
  user,
  projet,
  reference,
  error,
}: TransmettreDateMiseEnServiceProps) => {
  return (
    <LegacyPageTemplate user={user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Transmettre une date de mise en service</Heading1>
        </div>
        <form
          className="flex gap-3 flex-col"
          method="POST"
          action={routes.POST_TRANSMETTRE_DATE_MISE_EN_SERVICE(projet.id, reference)}
        >
          {error && <ErrorBox>{error}</ErrorBox>}
          <Heading2>Concernant le projet</Heading2>
          <ProjectInfo project={projet} className="mb-3" />
          <Heading2>Transmettre la date de mise en service</Heading2>
          <div>
            <Label htmlFor="dateMiseEnService">Date de mise en service (champ obligatoire)</Label>
            <Input type="date" id="dateMiseEnService" name="dateMiseEnService" required />
          </div>
          <Button type="submit" className="m-auto">
            Envoyer
          </Button>
        </form>
      </div>
    </LegacyPageTemplate>
  );
};
hydrateOnClient(TransmettreDateMiseEnService);
