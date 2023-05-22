import React from 'react';
import {
  PrimaryButton,
  Input,
  Label,
  PageTemplate,
  Heading1,
  Container,
  InfoBox,
  ImportIcon,
  ErrorBox,
  SuccessBox,
  Link,
} from '@components';
import routes from '@routes';
import { hydrateOnClient } from '@views/helpers';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { IdentifiantProjet } from '@potentiel/domain';

type Réussi = {
  référenceDossier: string;
  statut: 'réussi';
  identifiantProjet: IdentifiantProjet;
};
type Échec = {
  référenceDossier: string;
  statut: 'échec';
  raison: string;
  projets: ReadonlyArray<{
    id: string;
    nom: string;
  }>;
};
type Résultat = Réussi | Échec;

type ImporterDateMiseEnServiceUseCaseResult = Array<Résultat>;

type ImporterDatesMiseEnServiceProps = {
  user: UtilisateurReadModel;
  résultatImport?: ImporterDateMiseEnServiceUseCaseResult;
  formErrors?: Record<string, string>;
};

export const ImporterDatesMiseEnService = ({
  user,
  résultatImport,
  formErrors,
}: ImporterDatesMiseEnServiceProps) => {
  const isRéussi = (res: Résultat): res is Réussi => res.statut === 'réussi';
  const isÉchec = (res: Résultat): res is Échec => res.statut === 'échec';

  const importsRéussis = résultatImport?.filter(isRéussi) || [];
  const importsÉchoués = résultatImport?.filter(isÉchec) || [];
  const csvErrors = formErrors ? Object.entries(formErrors) : [];

  return (
    <PageTemplate user={user} currentPage="importer-dates-mise-en-service">
      <Container className="px-4 py-3 mb-4">
        <Heading1 className="flex items-center m-0 pt-8 pb-12">
          <ImportIcon className="mr-1" />
          Importer des dates de mise en service
        </Heading1>

        <div className="flex flex-col md:flex-row gap-4">
          <form
            className="flex gap-5 flex-col max-w-none w-full md:w-2/5 mx-0 self-center"
            action={routes.POST_IMPORTER_DATES_MISE_EN_SERVICE}
            method="post"
            encType="multipart/form-data"
          >
            <div>
              <Label htmlFor="fichier">Fichier .csv des dates de mise en service :</Label>
              <Input type="file" required name="fichier-dates-mise-en-service" id="fichier" />
            </div>

            <div className="flex flex-col md:flex-row mx-auto">
              <PrimaryButton type="submit">Importer</PrimaryButton>
            </div>
          </form>

          <InfoBox className="flex md:w-2/5 md:mx-auto" title="Format du fichier csv attendu">
            <table className="lg:mx-4 my-4 border-spacing-0">
              <thead>
                <tr>
                  <th
                    className="bg-grey-950-base border-solid border-0 border-b-2 border-b-grey-920-base text-left p-4"
                    scope="col"
                  >
                    Colonne
                  </th>
                  <th
                    className="bg-grey-950-base border-solid border-0 border-b-2 border-b-grey-920-base text-left p-4"
                    scope="col"
                  >
                    Format
                  </th>
                </tr>
              </thead>
              <tbody className="bg-grey-950-base">
                <tr className="odd:bg-grey-975-base">
                  <td className="text-left p-4">référenceDossier</td>
                  <td className="text-left p-4">chaîne de caractères</td>
                </tr>
                <tr className="odd:bg-grey-975-base">
                  <td className="text-left p-4">dateMiseEnService</td>
                  <td className="text-left p-4">date au format JJ/MM/AAAA</td>
                </tr>
              </tbody>
            </table>
          </InfoBox>
        </div>

        {csvErrors.length > 0 && (
          <ErrorBox className="mt-4" title="Le fichier CSV n'est pas valide">
            <ul>
              {Object.entries(csvErrors).map(([key, value]) => (
                <li key={key} className="ml-3">
                  {value}
                </li>
              ))}
            </ul>
          </ErrorBox>
        )}

        {importsRéussis.length > 0 && (
          <SuccessBox
            className="mt-4"
            title={`${importsRéussis.length} projet${
              importsRéussis.length === 1 ? ' a' : 's ont'
            } été mis à jour`}
          ></SuccessBox>
        )}

        {importsÉchoués.length > 0 && (
          <ErrorBox
            className="mt-4"
            title={`${importsÉchoués.length} import${
              importsÉchoués.length === 1 ? `n'a` : `s n'ont`
            } pas abouti`}
          >
            <ul>
              {importsÉchoués.map((échec) => (
                <>
                  <li>
                    {échec.raison} [<span className="font-bold">{échec.référenceDossier}</span>]
                  </li>
                  {échec.projets.length > 0 && (
                    <ul>
                      {échec.projets.map((p) => (
                        <li>
                          <Link href={routes.PROJECT_DETAILS(p.id)}>{p.nom}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ))}
            </ul>
          </ErrorBox>
        )}
      </Container>
    </PageTemplate>
  );
};

hydrateOnClient(ImporterDatesMiseEnService);
