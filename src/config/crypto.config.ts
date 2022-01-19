import { makeBuildProjectIdentifier } from '@infra/crypto'

if (!process.env.POTENTIEL_IDENTIFIER_SECRET) {
  console.error('ERROR: POTENTIEL_IDENTIFIER_SECRET not recognized')
  process.exit(1)
}

const potentielIdentifierSecret: string = process.env.POTENTIEL_IDENTIFIER_SECRET

export const buildProjectIdentifier = makeBuildProjectIdentifier(potentielIdentifierSecret)
