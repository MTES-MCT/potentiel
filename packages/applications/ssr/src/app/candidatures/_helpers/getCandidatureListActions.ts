import { match } from 'ts-pattern';

import { CandidatureListItemActionsProps } from '@/components/pages/candidature/lister/CandidatureListItemActions';

type Props = {
  estNotifiée: boolean;
  aUneAttestation: boolean;
};

export const getCandidatureListActions = (
  props: Props,
): CandidatureListItemActionsProps['actions'] =>
  match(props)
    .returnType<CandidatureListItemActionsProps['actions']>()
    .with({ estNotifiée: false }, () => ({ télécharger: false, prévisualiser: true }))
    .with({ estNotifiée: true, aUneAttestation: true }, () => ({
      télécharger: true,
      prévisualiser: false,
    }))
    .otherwise(() => ({ télécharger: false, prévisualiser: false }));
