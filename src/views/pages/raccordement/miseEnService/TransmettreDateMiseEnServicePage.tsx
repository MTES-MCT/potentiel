import React from 'react';

import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  PrimaryButton,
  ErrorBox,
  Heading2,
  Input,
  Label,
  Link,
  PageProjetTemplate,
  Form,
  InfoBox,
} from '../../../components';
import { afficherDate, formatDateForInput, hydrateOnClient } from '../../../helpers';
import { CandidatureLegacyReadModel, DossierRaccordementReadModel } from '@potentiel/domain-views';
import routes from '../../../../routes';
import { TitrePageRaccordement } from '../components/TitrePageRaccordement';

type TransmettreDateMiseEnServiceProps = {
  user: UtilisateurReadModel;
  projet: CandidatureLegacyReadModel;
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
    <PageProjetTemplate titre={<TitrePageRaccordement />} user={user} résuméProjet={projet}>
      <p className="my-2 p-0">Référence du dossier de raccordement : {référence}</p>
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
              min={formatDateForInput(projet.dateNotificationProjet)}
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
        <InfoBox className='flex md:w-1/3 md:mx-auto"'>
          La date de mise en service est comprise dans l'intervalle entre la date de notification du
          projet ({afficherDate(new Date(projet.dateNotificationProjet))}) et ce jour.
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};
hydrateOnClient(TransmettreDateMiseEnService);
