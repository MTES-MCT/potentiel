import { match, P } from 'ts-pattern';

import type { CandidatureListItemActionsProps } from '@/app/candidatures/(liste)/CandidatureListItemActions';

type Props = {
  estNotifiée: boolean;
  attestation?: string;
};

export const getCandidatureListActions = (
  props: Props,
): CandidatureListItemActionsProps['actions'] =>
  match(props)
    .returnType<CandidatureListItemActionsProps['actions']>()
    .with({ estNotifiée: false }, () => ({ télécharger: undefined, prévisualiser: true }))
    .with({ estNotifiée: true, attestation: P.string }, ({ attestation }) => ({
      télécharger: { url: attestation },
      prévisualiser: false,
    }))
    .otherwise(() => ({ télécharger: undefined, prévisualiser: false }));
