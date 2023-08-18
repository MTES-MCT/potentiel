import React from 'react';

import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
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
} from '../../../components';
import { formatDateForInputMaxDate, hydrateOnClient } from '../../../helpers';
import { ProjetReadModel, DossierRaccordementReadModel } from '@potentiel/domain-views';
import routes from '../../../../routes';
import { TitrePageRaccordement } from '../components/TitrePageRaccordement';

type TransmettrePropositionTechniqueEtFinancièreProps = {
  user: UtilisateurReadModel;
  projet: ProjetReadModel;
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
          <Heading2 className="mb-0">Transmettre la proposition technique et financière</Heading2>

          <p className="text-sm italic m-0">Tous les champs sont obligatoires</p>

          {error && <ErrorBox>{error}</ErrorBox>}

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
              max={formatDateForInputMaxDate(new Date())}
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
          La proposition technique et financière transmise sur Potentiel facilitera vos démarches
          administratives avec le cocontractant connecté à Potentiel, notamment pour des retards de
          délai de raccordement.
          <br /> Le dépôt dans Potentiel est informatif, il ne remplace pas la transmission à votre
          gestionnaire de réseau.
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};
hydrateOnClient(TransmettrePropositionTechniqueEtFinancière);
