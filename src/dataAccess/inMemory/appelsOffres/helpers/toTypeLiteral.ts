import { ValuesType } from 'utility-types'
import { asLiteral } from '../../../../helpers/asLiteral'

type Type = {
  type:
    | 'string'
    | 'number'
    | 'date'
    | 'stringEquals' // column should equals value
    | 'orNumberInColumn' // if column is empty, check try column
    | 'orStringInColumn' // if column is empty, check try column
    | 'codePostal' // Special case where we want to extend departement / région from codePostal
}

const toTypeLiteral = (str) => asLiteral<ValuesType<Type>>(str)

export default toTypeLiteral
