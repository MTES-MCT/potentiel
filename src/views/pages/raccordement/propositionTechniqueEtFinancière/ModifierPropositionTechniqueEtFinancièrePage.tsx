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
  InputFile,
  ChampsObligatoiresLégende,
} from '../../../components';
import { formatDateForInput, formatDateForInputMaxDate, hydrateOnClient } from '../../../helpers';
import { ProjetReadModel, DossierRaccordementReadModel } from '@potentiel/domain-views';
import routes from '../../../../routes';
import { TitrePageRaccordement } from '../components/TitrePageRaccordement';

type ModifierPropositionTechniqueEtFinancièreProps = {
  user: UtilisateurReadModel;
  projet: ProjetReadModel;
  dossierRaccordement: DossierRaccordementReadModel;
  error?: string;
};

export const ModifierPropositionTechniqueEtFinancière = ({
  user,
  projet,
  dossierRaccordement: { référence, propositionTechniqueEtFinancière },
  error,
}: ModifierPropositionTechniqueEtFinancièreProps) => {
  const { identifiantProjet } = projet;

  return (
    <PageProjetTemplate titre={<TitrePageRaccordement />} user={user} résuméProjet={projet}>
      <p className="my-2 p-0">Référence du dossier de raccordement : {référence}</p>
      <div className="flex flex-col md:flex-row gap-4">
        <Form
          className="flex gap-3 flex-col max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIERE(
            identifiantProjet,
            référence,
          )}
        >
          <Heading2 className="mb-0">Modifier la proposition technique et financière</Heading2>

          <ChampsObligatoiresLégende />

          {error && <ErrorBox>{error}</ErrorBox>}

          <div>
            <Label htmlFor="file">Proposition technique et financière signée</Label>
            <InputFile
              id="file"
              name="file"
              fileUrl={
                propositionTechniqueEtFinancière?.propositionTechniqueEtFinancièreSignée.format
                  ? routes.GET_PROPOSITION_TECHNIQUE_ET_FINANCIERE_FILE(
                      identifiantProjet,
                      référence,
                    )
                  : undefined
              }
            />
          </div>
          <div>
            <Label htmlFor="dateSignature">Date de signature</Label>
            <Input
              type="date"
              id="dateSignature"
              name="dateSignature"
              defaultValue={
                propositionTechniqueEtFinancière?.dateSignature &&
                formatDateForInput(propositionTechniqueEtFinancière?.dateSignature)
              }
              max={formatDateForInputMaxDate(new Date())}
              required
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

        <InfoBox className="flex md:w-1/3 md:mx-auto" title="Concernant le dépôt">
          Le dépôt est informatif, il ne remplace pas la transmission à votre gestionnaire.
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};
hydrateOnClient(ModifierPropositionTechniqueEtFinancière);
