import React from 'react';
import {
  AlertBox,
  ArrowLeftIcon,
  ChampsObligatoiresLégende,
  ErrorBox,
  Form,
  InfoBox,
  Input,
  InputFile,
  Label,
  PageProjetTemplate,
  PrimaryButton,
  RésuméProjet,
  SecondaryLinkButton,
} from '../../components';
import { DetailDemandeDelaiPageDTO } from '../../../modules/modificationRequest/dtos';
import { UtilisateurReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { afficherDate, formatDateForInput, hydrateOnClient } from '../../helpers';
import routes from '../../../routes';
import { DownloadResponseTemplate } from '../modificationRequestPage/components';

type CorrigerDelaiAccordeProps = {
  demandeDélai: DetailDemandeDelaiPageDTO;
  résuméProjet: RésuméProjet;
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
        <Form
          className="my-4 flex flex-col gap-7 mx-auto"
          action={routes.POST_CORRIGER_DELAI_ACCORDE}
          method="post"
          encType="multipart/form-data"
        >
          <ChampsObligatoiresLégende />
          {error && <ErrorBox>{error}</ErrorBox>}
          <div>
            <input type="hidden" name="demandeDelaiId" value={demandeDélai.id} />
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
              id="dateAchevementAccordee"
              name="dateAchevementAccordee"
              defaultValue={formatDateForInput(dateAchèvementActuelle)}
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
            <Label htmlFor="file">Nouvelle réponse signée (fichier pdf)*</Label>
            <ol>
              <li>
                <DownloadResponseTemplate modificationRequest={demandeDélai} />
              </li>
              <li>
                <span>Téléversez le courrier signé : </span>
                <InputFile />
              </li>
            </ol>
          </div>
          <AlertBox>
            Attention : une fois ce délai corrigé, vous ne pourrez plus le corriger de nouveau.
          </AlertBox>
          <div className="flex flex-col md:flex-row gap-4 mx-auto">
            <SecondaryLinkButton href={routes.GET_DETAILS_DEMANDE_DELAI_PAGE(demandeDélai.id)}>
              <ArrowLeftIcon aria-hidden className="w-5 h-5 mr-2" />
              Retour vers la demande
            </SecondaryLinkButton>
            <PrimaryButton
              type="submit"
              confirmation={`Vous ne pouvez corriger un délai accordé qu'une seule fois. Êtes-vous sûr de vouloir corriger le délai accordé ?`}
            >
              Enregistrer la correction
            </PrimaryButton>
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
            <li className="mb-4">
              La date limite d'achèvement actuelle du projet est le{' '}
              {afficherDate(new Date(dateAchèvementActuelle))}.
            </li>
            <li>
              * Il est nécéssaire de joindre un nouveau courrier de réponse pour valider la
              correction. La DREAL/DEAL reste libre d'adapter le modèle de réponse fourni en
              fonction de la situation.
            </li>
          </ul>
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};

hydrateOnClient(CorrigerDelaiAccorde);
