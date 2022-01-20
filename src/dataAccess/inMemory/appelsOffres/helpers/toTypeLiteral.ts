import { ValuesType } from 'utility-types'
import { AppelOffre } from '@entities'
import { asLiteral } from '../../../../helpers/asLiteral'

const toTypeLiteral = (str) => asLiteral<ValuesType<AppelOffre['dataFields']>['type']>(str)

export default toTypeLiteral
