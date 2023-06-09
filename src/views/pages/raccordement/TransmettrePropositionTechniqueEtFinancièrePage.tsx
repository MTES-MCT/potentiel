import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  PrimaryButton,
  Callout,
  ErrorBox,
  Heading2,
  InfoBox,
  Input,
  Label,
  Link,
  PageProjetTemplate,
  PlugIcon,
  Form,
} from '@components';
import { afficherDate, hydrateOnClient } from '../../helpers';
import routes from '@routes';
import { ConsulterProjetReadModel } from '@potentiel/domain-views';

type TransmettrePropositionTechniqueEtFinancièreProps = {
  user: UtilisateurReadModel;
  projet: ConsulterProjetReadModel;
  reference: string;
  error?: string;
  dateSignatureActuelle?: string;
};

export const TransmettrePropositionTechniqueEtFinancière = ({
  user,
  projet,
  reference,
  error,
  dateSignatureActuelle,
}: TransmettrePropositionTechniqueEtFinancièreProps) => {
  const { identifiantProjet } = projet;

  return (
    <PageProjetTemplate
      titre={
        <>
          <PlugIcon className="mr-1" />
          Raccordement
        </>
      }
      user={user}
      résuméProjet={projet}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <Form
          className="flex gap-3 flex-col max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE(
            identifiantProjet,
            reference,
          )}
        >
          {error && <ErrorBox>{error}</ErrorBox>}
          <Heading2 className="mb-0">Transmettre la proposition technique et financière</Heading2>

          <Callout className="text-sm px-3 pt-1 pb-0">
            <ul className="list-none p-0">
              <li className="my-0">
                Référence du dossier de raccordement :{' '}
                <span className="font-bold">{reference}</span>
              </li>
              {dateSignatureActuelle && (
                <li className="my-0">
                  Date de signature de la proposition technique et financière actuelle :{' '}
                  <span className="font-bold">{afficherDate(new Date(dateSignatureActuelle))}</span>
                </li>
              )}
            </ul>
          </Callout>

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
