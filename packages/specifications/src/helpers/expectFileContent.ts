import { assert, expect } from 'chai';
import { mediator } from 'mediateur';

import { DocumentProjet, ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';

import { convertReadableStreamToString } from './convertReadableToString';

export const expectFileContent = async (
  actual: Option.Type<DocumentProjet.ValueType>,
  expected: { format: string; content: string } | undefined,
) => {
  if (!expected) {
    assert(Option.isNone(actual), `Aucun document n'était attendu !`);
    return;
  }
  assert(Option.isSome(actual), `Un document était attendu !`);

  const result = await mediator.send<ConsulterDocumentProjetQuery>({
    type: 'Document.Query.ConsulterDocumentProjet',
    data: {
      documentKey: actual.formatter(),
    },
  });

  assert(Option.isSome(result), `Pièce justificative non trouvée !`);
  expect(result.format).to.be.equal(expected.format, 'Le format du document est incorrect');

  const actualContent = await convertReadableStreamToString(result.content);

  expect(actualContent).to.be.equal(expected.content);
};
