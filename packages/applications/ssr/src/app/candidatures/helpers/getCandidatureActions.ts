import { CandidatureListItemActionsProps } from '@/components/pages/candidature/lister/CandidatureListItemActions';

type Props = {
  estNotifiée: boolean;
  estPériodeLegacy: boolean;
};

export const getCandidatureActions = ({
  estNotifiée,
  estPériodeLegacy,
}: Props): CandidatureListItemActionsProps['actions'] => {
  if (estNotifiée) {
    return {
      télécharger: true,
      prévisualiser: false,
    };
  }
  if (!estNotifiée && !estPériodeLegacy) {
    return {
      télécharger: false,
      prévisualiser: true,
    };
  }
  return {
    télécharger: false,
    prévisualiser: false,
  };
};
