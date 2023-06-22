import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  PrimaryButton,
  ErrorBox,
  Heading2,
  Input,
  Label,
  Link,
  PageProjetTemplate,
  Form,
} from '@components';
import { formatDateForInput, hydrateOnClient } from '../../../helpers';
import routes from '@routes';
import { ConsulterProjetReadModel, DossierRaccordementReadModel } from '@potentiel/domain-views';
import { TitrePageRaccordement } from '../components/TitrePageRaccordement';

type TransmettreDateMiseEnServiceProps = {
  user: UtilisateurReadModel;
  projet: ConsulterProjetReadModel;
  dossierRaccordement: DossierRaccordementReadModel;
  error?: string;
};

export const TransmettreDateMiseEnService = ({
  user,
  dossierRaccordement: { référence, miseEnService },
  error,
  projet,
}: TransmettreDateMiseEnServiceProps) => {
  const { identifiantProjet } = projet;

  return (
    <PageProjetTemplate
      titre={
        <TitrePageRaccordement>
          <p className="my-2 p-0">Référence du dossier de raccordement : {référence}</p>
        </TitrePageRaccordement>
      }
      user={user}
      résuméProjet={projet}
    >
      <Heading2 className="mb-0">Transmettre la date de mise en service</Heading2>
      <div className="flex flex-col md:flex-row gap-4">
        <Form
          className="mx-auto mt-6"
          method="POST"
          action={routes.POST_TRANSMETTRE_DATE_MISE_EN_SERVICE(identifiantProjet, référence)}
        >
          {error && <ErrorBox>{error}</ErrorBox>}

          <div>
            <Label htmlFor="dateMiseEnService">Date de mise en service (champ obligatoire)</Label>
            <Input
              type="date"
              id="dateMiseEnService"
              name="dateMiseEnService"
              defaultValue={miseEnService && formatDateForInput(miseEnService.dateMiseEnService)}
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
      </div>
    </PageProjetTemplate>
  );
};
hydrateOnClient(TransmettreDateMiseEnService);
