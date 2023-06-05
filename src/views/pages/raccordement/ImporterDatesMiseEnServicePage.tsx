import React, { useState } from 'react';
import {
  PrimaryButton,
  Input,
  Label,
  PageTemplate,
  Heading1,
  InfoBox,
  ImportIcon,
  ErrorBox,
  SuccessBox,
  Dialog,
  Spinner,
} from '@components';
import routes from '@routes';
import { hydrateOnClient } from '@views/helpers';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { CsvError } from '../../../controllers/helpers/mapCsvYupValidationErrorToCsvErrors';

type Réussi = {
  référenceDossier: string;
  statut: 'réussi';
};
type Échec = {
  référenceDossier: string;
  statut: 'échec';
  raison: string;
};
type Résultat = Réussi | Échec;

type RésultatImporterDatesMiseEnServiceProps = Array<Résultat>;

type ImporterDatesMiseEnServiceProps = {
  user: UtilisateurReadModel;
  résultatImport?: RésultatImporterDatesMiseEnServiceProps;
  csvErrors: ReadonlyArray<CsvError>;
};

export const ImporterDatesMiseEnService = ({
  user,
  résultatImport,
  csvErrors,
}: ImporterDatesMiseEnServiceProps) => {
  const isRéussi = (res: Résultat): res is Réussi => res.statut === 'réussi';
  const isÉchec = (res: Résultat): res is Échec => res.statut === 'échec';

  const importsRéussis = résultatImport?.filter(isRéussi) ?? [];
  const importsÉchoués = résultatImport?.filter(isÉchec) ?? [];

  const [isImportInProgress, setIsImportInProgress] = useState(false);

  return (
    <PageTemplate
      user={user}
      currentPage="importer-dates-mise-en-service"
      contentHeader={<div className="text-3xl">Imports</div>}
    >
      <Heading1 className="flex items-center m-0 pt-8 pb-12">
        <ImportIcon className="mr-1" />
        Importer des dates de mise en service
      </Heading1>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <form
          className="flex gap-5 flex-col max-w-none w-full md:w-2/5 mx-0 self-center"
          action={routes.POST_IMPORTER_DATES_MISE_EN_SERVICE}
          method="post"
          encType="multipart/form-data"
          onSubmit={() => setIsImportInProgress(true)}
        >
          <Dialog open={isImportInProgress}>
            <Heading1 className="flex flex-col text-center m-0 p-0">
              <div className="mx-auto mb-5">
                <Spinner className="text-blue-france-sun-base w-12 h-12" />
              </div>
              Import en cours
            </Heading1>

            <p className="italic text-center">
              Ce traitement peut prendre jusqu'à 2 minutes, merci de patienter 🙏
            </p>
          </Dialog>

          <div>
            <Label htmlFor="fichier">Fichier .csv des dates de mise en service :</Label>
            <Input type="file" required name="fichier-dates-mise-en-service" id="fichier" />
          </div>

          <div className="flex flex-col md:flex-row mx-auto">
            <PrimaryButton type="submit" disabled={isImportInProgress}>
              Importer
            </PrimaryButton>
          </div>
        </form>

        <InfoBox className="flex" title="Format du fichier csv attendu">
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
                <td className="text-left p-4">referenceDossier</td>
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
            {csvErrors.map(({ numéroLigne, valeurInvalide, raison }) => (
              <li key={`csv-error-line-${numéroLigne}`} className="ml-3">
                Ligne {numéroLigne} : {raison}
                {valeurInvalide && `[${valeurInvalide}]`}
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
            importsÉchoués.length === 1 ? ` n'a` : `s n'ont`
          } pas abouti`}
        >
          <ul>
            {importsÉchoués.map(({ raison, référenceDossier }) => (
              <li key={`import-échoué-${référenceDossier}`}>
                {raison} [<span className="font-bold">{référenceDossier}</span>]
              </li>
            ))}
          </ul>
        </ErrorBox>
      )}
    </PageTemplate>
  );
};

hydrateOnClient(ImporterDatesMiseEnService);
