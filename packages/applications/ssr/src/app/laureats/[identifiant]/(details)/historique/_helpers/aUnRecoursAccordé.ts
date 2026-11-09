import { match, P } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

export const aUnRecoursAccordé = (items: ReadonlyArray<Lauréat.HistoriqueListItemReadModels>) =>
  items.some(
    (item) =>
      item.category === 'recours' &&
      match(item)
        .returnType<boolean>()
        .with({ type: P.union('RecoursAccordé-V1', 'RecoursAccordé-V2') }, () => true)
        .with(
          {
            type: P.union(
              'RecoursDemandé-V1',
              'RecoursAnnulé-V1',
              'RecoursPasséEnInstruction-V1',
              'RecoursRejeté-V1',
            ),
          },
          () => false,
        )
        .exhaustive(),
  );
