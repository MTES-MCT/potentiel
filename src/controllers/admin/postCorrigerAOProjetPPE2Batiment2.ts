import { importAppelOffreData } from '@config'
import { logger } from '@core/utils'
import asyncHandler from '../helpers/asyncHandler'
import { addQueryParams } from '../../helpers/addQueryParams'
import { parseCsv } from '../../helpers/parseCsv'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { ensureRole } from '@config'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

v1Router.post(
  'admin/corriger-ao-projet-ppe2-batiment2',
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {})
)
