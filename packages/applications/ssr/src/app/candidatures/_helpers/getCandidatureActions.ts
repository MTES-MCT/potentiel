import { match } from 'ts-pattern';

import { CandidatureListItemActionsProps } from '@/components/pages/candidature/lister/CandidatureListItemActions';

type Props = {
  estNotifiée: boolean;
  estPériodeLegacy: boolean;
};

export const getCandidatureActions = (props: Props): CandidatureListItemActionsProps['actions'] =>
  match(props)
    .returnType<CandidatureListItemActionsProps['actions']>()
    .with({ estNotifiée: true }, () => ({ télécharger: true, prévisualiser: false }))
    .with({ estPériodeLegacy: true }, () => ({ télécharger: false, prévisualiser: false }))
    .otherwise(() => ({ télécharger: false, prévisualiser: true }));
