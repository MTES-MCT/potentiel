import React from 'react';
import {
  ArrowLeftIcon,
  ChampsObligatoiresLégende,
  ErrorBox,
  Form,
  InfoBox,
  Input,
  Label,
  PageProjetTemplate,
  PrimaryButton,
  SecondaryLinkButton,
} from '../../components';
import { DetailDemandeDelaiPageDTO } from '../../../modules/modificationRequest/dtos';
import { CandidatureLegacyReadModel } from '@potentiel/domain-views';
import { UtilisateurReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { afficherDate, formatDateForInput, hydrateOnClient } from '../../helpers';
import routes from '../../../routes';
import { DownloadResponseTemplate } from '../modificationRequestPage/components';

type CorrigerDelaiAccordeProps = {
  demandeDélai: DetailDemandeDelaiPageDTO;
  résuméProjet: CandidatureLegacyReadModel;
  dateAchèvementInitiale: string;
  dateAchèvementActuelle: string;
  utilisateur: UtilisateurReadModel;
  error?: string;
};

export const CorrigerDelaiAccorde = ({
  demandeDélai,
  résuméProjet,
  utilisateur,
  dateAchèvementInitiale,
  dateAchèvementActuelle,
  error,
}: CorrigerDelaiAccordeProps) => {
  return (
    <PageProjetTemplate
      titre="Corriger un délai accordé"
      user={utilisateur}
      résuméProjet={résuméProjet}
    >
      <div className="flex flex-col md:flex-row">
        <Form className="my-4 flex flex-col gap-7 mx-auto">
          <ChampsObligatoiresLégende />
          {error && <ErrorBox>{error}</ErrorBox>}
          <div>
            <Label htmlFor="dateAchevement">Nouvelle date limite d'achèvement</Label>
            <p className="text-sm italic m-0">
              La date saisie remplacera la date limite d'achèvement actuelle du projet.
              <br />
              Elle ne peut pa être antérieure à la date d'achèvement initiale du projet (
              {afficherDate(new Date(dateAchèvementInitiale))}).
            </p>
            <Input
              type="date"
              min={formatDateForInput(dateAchèvementInitiale)}
              id="dateAchevement"
              name="dateAchevement"
              required
              aria-required
            />
          </div>
          <div>
            <Label htmlFor="explications">Explications pour le porteur (optionnel)</Label>
            <p className="text-sm italic m-0">
              L'explications sera envoyée au porteur par courriel.
            </p>
            <Input type="text" id="explications" name="explications" />
          </div>
          <div>
            <Label htmlFor="file">Nouvelle réponse signée (fichier pdf)</Label>
            <ol>
              <li>
                <DownloadResponseTemplate modificationRequest={demandeDélai} />
              </li>
              <li>
                <span>Téléversez le courrier signé : </span>
                <Input type="file" name="file" id="file" required aria-required />
              </li>
            </ol>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mx-auto">
            <SecondaryLinkButton href={routes.GET_DETAILS_DEMANDE_DELAI_PAGE(demandeDélai.id)}>
              <ArrowLeftIcon aria-hidden className="w-5 h-5 mr-2" />
              Retour vers la demande
            </SecondaryLinkButton>
            <PrimaryButton type="submit">Enregistrer la correction</PrimaryButton>
          </div>
        </Form>
        <InfoBox className="md:w-1/3 md:mx-auto">
          <ul>
            {demandeDélai.acceptanceParams?.delayInMonths && (
              <li className="mb-4">
                Lors de l'instruction initiale de la demande, un délai de{' '}
                {demandeDélai.delayInMonths} mois a été accordé.
              </li>
            )}
            {demandeDélai.acceptanceParams?.dateAchèvementAccordée && (
              <li className="mb-4">
                Lors de l'instruction initiale de la demande de délai, la date limite d'achèvement a
                été reportée au{' '}
                {afficherDate(new Date(demandeDélai.acceptanceParams.dateAchèvementAccordée))}.
              </li>
            )}
            <li className="m-0">
              La date limite d'achèvement actuelle du projet est le{' '}
              {afficherDate(new Date(dateAchèvementActuelle))}.
            </li>
          </ul>
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};

hydrateOnClient(CorrigerDelaiAccorde);
