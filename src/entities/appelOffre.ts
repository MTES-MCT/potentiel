import {
  String,
  Number,
  Record,
  Array,
  Union,
  Literal,
  Boolean,
  Static,
  Unknown,
  Partial,
  Undefined,
} from '../types/schemaTypes'
import buildMakeEntity from '../helpers/buildMakeEntity'

import { periodeSchema } from './periode'
import { familleSchema } from './famille'

const csvFieldSchema = Record({
  field: String,
  column: String,
  type: Union(
    Literal('string'),
    Literal('number'),
    Literal('date'),
    Literal('stringEquals'), // column should equals value
    Literal('orNumberInColumn'), // if column is empty, check try column
    Literal('orStringInColumn'), // if column is empty, check try column
    Literal('codePostal') // Special case where we want to extend departement / région from codePostal
  ),
}).And(
  Partial({
    value: String,
    defaultValue: Unknown,
  })
)

const baseAppelOffreSchema = Record({
  id: String,
  title: String,
  shortTitle: String,
  launchDate: String,
  unitePuissance: String,
  delaiRealisationEnMois: Number,
  paragraphePrixReference: String,
  paragrapheDelaiDerogatoire: String,
  paragrapheAttestationConformite: String,
  paragrapheEngagementIPFP: String,
  afficherParagrapheInstallationMiseEnServiceModification: Boolean,
  renvoiModification: String,
  affichageParagrapheECS: Boolean,
  renvoiDemandeCompleteRaccordement: String,
  renvoiRetraitDesignationGarantieFinancieres: String,
  renvoiEngagementIPFP: String,
  paragrapheClauseCompetitivite: String,
  tarifOuPrimeRetenue: String,
  afficherValeurEvaluationCarbone: Boolean,
  afficherPhraseRegionImplantation: Boolean,
  periodes: Array(periodeSchema),
  familles: Array(familleSchema),
  dataFields: Array(csvFieldSchema),
})

const appelOffreSchema = baseAppelOffreSchema.And(
  Partial({
    periode: periodeSchema,
  })
)

const fields: string[] = [
  'periode',
  ...Object.keys(baseAppelOffreSchema.fields),
]

type AppelOffre = Static<typeof appelOffreSchema>

interface MakeAppelOffreDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeAppelOffreDependencies) =>
  buildMakeEntity<AppelOffre>(appelOffreSchema, makeId, fields)

export { AppelOffre, appelOffreSchema }
