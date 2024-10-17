import { match } from 'ts-pattern';

import { CandidatureListItemActionsProps } from '@/components/pages/candidature/lister/CandidatureListItemActions';

type Props = {
  estNotifiée: boolean;
  aUneAttestation: boolean;
};

export const getCandidatureActions = (props: Props): CandidatureListItemActionsProps['actions'] =>
  match(props)
    .returnType<CandidatureListItemActionsProps['actions']>()
    .with({ aUneAttestation: false }, () => ({ télécharger: false, prévisualiser: false }))
    .with({ estNotifiée: true }, () => ({ télécharger: true, prévisualiser: false }))
    .otherwise(() => ({ télécharger: false, prévisualiser: true }));
