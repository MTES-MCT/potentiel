import React from 'react'
import {
  Input,
  Label,
  AdminDashboard,
  Button,
  PageTemplate,
  SuccessErrorBox,
  CsvValidationErrorBox,
} from '@components'
import routes from '@routes'
import { Request } from 'express'

type RésultatSoumissionFormulaire =
  | {
      type: 'succès'
    }
  | {
      type: 'échec'
      raison: string
      erreursDeValidationCsv?: Array<{
        numéroLigne: number
        valeurInvalide: string
        raison: string
      }>
    }

type ImportGestionnaireReseauProps = {
  request: Request
  résultatSoumissionFormulaire?: RésultatSoumissionFormulaire
}

type RésultatSoumissionFormulaireProps = {
  résultatSoumissionFormulaire: RésultatSoumissionFormulaire
}

const AfficherFeedback = ({ résultatSoumissionFormulaire }: RésultatSoumissionFormulaireProps) => {
  switch (résultatSoumissionFormulaire.type) {
    case 'succès':
      return <SuccessErrorBox success="L'import du fichier a démarré." />
    case 'échec':
      return résultatSoumissionFormulaire.erreursDeValidationCsv &&
        résultatSoumissionFormulaire.erreursDeValidationCsv?.length > 0 ? (
        <CsvValidationErrorBox
          validationErreurs={résultatSoumissionFormulaire.erreursDeValidationCsv}
        />
      ) : (
        <SuccessErrorBox error={résultatSoumissionFormulaire.raison} />
      )
  }
}

export const ImportGestionnaireReseau = ({
  request,
  résultatSoumissionFormulaire,
}: ImportGestionnaireReseauProps) => (
  <PageTemplate user={request.user}>
    <AdminDashboard currentPage="import-gestionnaire-réseau" role="admin">
      <div className="panel p-4">
        <h3 className="section--title">Import gestionnaire réseau</h3>
        {résultatSoumissionFormulaire && <AfficherFeedback {...{ résultatSoumissionFormulaire }} />}
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
