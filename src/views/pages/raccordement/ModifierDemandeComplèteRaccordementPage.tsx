import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  Button,
  ErrorBox,
  ExternalLink,
  Heading2,
  InfoBox,
  Input,
  Label,
  PlugIcon,
  Link,
  PageProjetTemplate,
  Callout,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import { GestionnaireRéseauReadModel, RésuméProjetReadModel } from '@potentiel/domain';
import routes from '@routes';

type ModifierDemandeComplèteRaccordementProps = {
  identifiantProjet: string;
  user: UtilisateurReadModel;
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
  résuméProjet: RésuméProjetReadModel;
  error?: string;
  reference: string;
  dateQualificationActuelle: string;
};

export const ModifierDemandeComplèteRaccordement = ({
  user,
  identifiantProjet,
  résuméProjet,
  error,
  reference,
  dateQualificationActuelle,
}: ModifierDemandeComplèteRaccordementProps) => {
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
          encType="multipart/form-data"
          action={routes.POST_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT(identifiantProjet)}
        >
          {error && <ErrorBox>{error}</ErrorBox>}

          <Heading2>Transmettre une demande complète de raccordement</Heading2>

          <Callout className="text-sm my-4 px-3 pt-1 pb-0">
            <ul className="list-none p-0">
              <li className="my-0">
                Référence du dossier de raccordement :{' '}
                <span className="font-bold">{reference}</span>
              </li>
              {dateQualificationActuelle && (
                <li className="my-0">
                  Date de qualification actuelle de la demande complète de raccordement :{' '}
                  <span className="font-bold">
                    {afficherDate(new Date(dateQualificationActuelle))}
                  </span>
                </li>
              )}
            </ul>
          </Callout>

          <p className="text-sm italic m-0">Tous les champs sont obligatoires</p>

          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="file">
                Accusé de réception de la demande complète de raccordement
              </Label>
              <Input type="file" id="file" name="file" required />
            </div>

            <div>
              <Label htmlFor="dateQualification">Date de qualification</Label>
              <Input type="date" id="dateQualification" name="dateQualification" required />
            </div>

            <div className="flex flex-col md:flex-row gap-4 m-auto">
              <Button type="submit">Transmettre</Button>
              <Link href={routes.PROJECT_DETAILS(identifiantProjet)} className="m-auto">
                Retour vers le projet
              </Link>
            </div>
          </div>
        </form>

        <InfoBox
          className="flex md:w-1/3 md:mx-auto"
          title="* Où trouver la référence du dossier de raccordement ?"
        >
          Vous pouvez retrouver cette donnée sur le courriel d'accusé de réception de votre demande
          complète de raccordement (
          <ExternalLink href="https://docs.potentiel.beta.gouv.fr/gerer-mes-projets-et-documents/comment-transmettre-ma-demande-complete-de-raccordement-dcr">
            Voir un exemple
          </ExternalLink>
          )
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};

hydrateOnClient(ModifierDemandeComplèteRaccordement);
