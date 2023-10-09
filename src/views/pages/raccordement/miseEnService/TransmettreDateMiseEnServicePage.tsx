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
  délaiCDC2022Appliqué?: true;
};

export const TransmettreDateMiseEnService = ({
  user,
  dossierRaccordement: { référence, miseEnService },
  error,
  projet,
  délaiCDC2022Appliqué,
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
              min={formatDateForInput(projet.dateDésignation)}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:mt-4">
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
          <ul>
            <li>
              La date de mise en service est comprise dans l'intervalle entre la date de désignation
              du projet ({afficherDate(new Date(projet.dateDésignation))}) et ce jour.
            </li>
            {délaiCDC2022Appliqué && (
              <li className="mt-4">
                Ce projet a déjà bénéficié du délai supplémentaire relatif du cahier des charges
                modification du 30/08/2022. Une modification de la date de mise en service peut
                remettre en cause l'application de ce délai et entraîner une modification de la date
                d'achèvement du projet.
              </li>
            )}
          </ul>
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};
hydrateOnClient(TransmettreDateMiseEnService);
