import { CandidatureListItemActionsProps } from '@/components/pages/candidature/lister/CandidatureListItemActions';

type Props = {
  estNotifiée: boolean;
  estPériodeLegacy: boolean;
};

export const getCandidatureActions = ({ estNotifiée, estPériodeLegacy }: Props) => {
  let actions: CandidatureListItemActionsProps['actions'];

  if (estNotifiée) {
    actions = {
      télécharger: true,
      prévisualiser: false,
    };
  } else if (!estNotifiée && !estPériodeLegacy) {
    actions = {
      télécharger: false,
      prévisualiser: true,
    };
  } else {
    actions = {
      télécharger: false,
      prévisualiser: false,
    };
  }

  return actions;
};
