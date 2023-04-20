import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  Button,
  ErrorBox,
  Heading2,
  Input,
  Label,
  Link,
  PageProjetTemplate,
  PlugIcon,
} from '@components';
import { afficherDate, hydrateOnClient } from '../../helpers';
import routes from '@routes';
import { RésuméProjetReadModel } from '@potentiel/domain';

type TransmettreDateMiseEnServiceProps = {
  identifiantProjet: string;
  user: UtilisateurReadModel;
  résuméProjet: RésuméProjetReadModel;
  reference: string;
  error?: string;
  dateMiseEnServiceActuelle?: string;
};

export const TransmettreDateMiseEnService = ({
  user,
  reference,
  error,
  résuméProjet,
  identifiantProjet,
  dateMiseEnServiceActuelle,
}: TransmettreDateMiseEnServiceProps) => {
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
          action={routes.POST_TRANSMETTRE_DATE_MISE_EN_SERVICE(identifiantProjet, reference)}
        >
          {error && <ErrorBox>{error}</ErrorBox>}
          <Heading2 className="mb-0">Transmettre la date de mise en service</Heading2>

          <ul className="list-none p-0">
            <li className="mt-0 mb-3">
              Référence du dossier de raccordement : <span className="font-bold">{reference}</span>
            </li>
            {dateMiseEnServiceActuelle && (
              <li className="mt-0 mb-3">
                Date de mise en service actuelle :{' '}
                <span className="font-bold">
                  {afficherDate(new Date(dateMiseEnServiceActuelle))}
                </span>
              </li>
            )}
          </ul>
          <div>
            <Label htmlFor="dateMiseEnService">
              Renseignez la date de mise en service (champ obligatoire) :
            </Label>
            <Input type="date" id="dateMiseEnService" name="dateMiseEnService" required />
          </div>

          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <Button type="submit">Transmettre</Button>
            <Link href={routes.PROJECT_DETAILS(identifiantProjet)} className="m-auto">
              Retour vers le projet
            </Link>
          </div>
        </form>
      </div>
    </PageProjetTemplate>
  );
};
hydrateOnClient(TransmettreDateMiseEnService);
