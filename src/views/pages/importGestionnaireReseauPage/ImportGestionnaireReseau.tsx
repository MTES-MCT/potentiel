import React, { FC } from 'react'
import { Input, Label, AdminDashboard, Button, PageTemplate, SuccessErrorBox } from '@components'
import routes from '@routes'
import { Request } from 'express'

type ErreurValidationCsv = {
  numéroLigne: number
  valeurInvalide?: string
  raison: string
}

type ImportGestionnaireReseauProps = {
  request: Request
  résultatSoumissionFormulaire?: RésultatSoumissionFormulaireProps['résultatSoumissionFormulaire']
}

type RésultatSoumissionFormulaireProps = {
  résultatSoumissionFormulaire:
    | {
        type: 'succès'
      }
    | {
        type: 'échec'
        raison: string
        erreursDeValidationCsv?: Array<ErreurValidationCsv>
      }
}

const RésultatSoumissionFormulaire: FC<RésultatSoumissionFormulaireProps> = ({
  résultatSoumissionFormulaire,
}) => {
  switch (résultatSoumissionFormulaire.type) {
    case 'succès':
      return <SuccessErrorBox success="L'import du fichier a démarré." />
    case 'échec':
      return résultatSoumissionFormulaire.erreursDeValidationCsv &&
        résultatSoumissionFormulaire.erreursDeValidationCsv?.length > 0 ? (
        <CsvValidationErrorBox
          erreursDeValidationCsv={résultatSoumissionFormulaire.erreursDeValidationCsv}
        />
      ) : (
        <SuccessErrorBox error={résultatSoumissionFormulaire.raison} />
      )
  }
}

type CsvValidationErrorBoxProps = {
  erreursDeValidationCsv: Array<ErreurValidationCsv>
}
const CsvValidationErrorBox: FC<CsvValidationErrorBoxProps> = ({ erreursDeValidationCsv }) => (
  <ul className="notification error">
    {erreursDeValidationCsv.map(({ numéroLigne, valeurInvalide, raison }, index) => (
      <li key={index} className="ml-3">
        {numéroLigne && `Ligne ${numéroLigne.toString()} - `}
        {valeurInvalide && `${valeurInvalide} - `}
        {raison && `${raison}`}
      </li>
    ))}
  </ul>
)

export const ImportGestionnaireReseau = ({
  request,
  résultatSoumissionFormulaire,
}: ImportGestionnaireReseauProps) => (
  <PageTemplate user={request.user}>
    <AdminDashboard currentPage="import-gestionnaire-réseau" role="admin">
      <div className="panel p-4">
        <h3 className="section--title">Import gestionnaire réseau</h3>
        {résultatSoumissionFormulaire && (
          <RésultatSoumissionFormulaire {...{ résultatSoumissionFormulaire }} />
        )}
        <form
          action={routes.POST_DEMARRER_IMPORT_GESTIONNAIRE_RESEAU}
          method="post"
          encType="multipart/form-data"
        >
          <Label htmlFor="fichier">Fichier .csv du gestionnaire de réseau :</Label>
          <Input type="file" required name="fichier-import-gestionnaire-réseau" id="fichier" />
          <Button type="submit" className="mt-4">
            Mettre les projets à jour
          </Button>
        </form>
      </div>
    </AdminDashboard>
  </PageTemplate>
)
