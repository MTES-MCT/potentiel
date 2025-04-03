import Button from '@codegouvfr/react-dsfr/Button';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';

type LinkedValuesButtonProps = {
  isLocked?: boolean;
  linked?: boolean;
  onButtonClick?: () => void;
  estEnCoursDeModification?: boolean;
  aDéjàEtéModifié?: boolean;
};

export const LinkedValuesButton = ({
  isLocked,
  linked,
  onButtonClick,
  estEnCoursDeModification,
  aDéjàEtéModifié,
}: LinkedValuesButtonProps) => {
  const label = aDéjàEtéModifié
    ? 'Cette valeur a été modifiée par rapport à la valeur initiale de candidature'
    : estEnCoursDeModification
      ? 'Une demande de modification est en cours sur ce champs, sa modification côté projet est impossible'
      : isLocked
        ? 'La valeur de candidature sera automatiquement appliquée au projet'
        : linked
          ? 'Ne pas appliquer les changements au projet'
          : 'Appliquer les changements au projet';

  if (aDéjàEtéModifié) {
    return (
      <div className="flex items-center justify-center w-10">
        <Tooltip kind="hover" title={label} />
      </div>
    );
  }

  return (
    <Tooltip kind="hover" title={label}>
      <Button
        type="button"
        iconId={linked ? 'fr-icon-lock-fill' : 'fr-icon-lock-unlock-fill'}
        title=""
        onClick={onButtonClick}
        disabled={estEnCoursDeModification || isLocked}
        nativeButtonProps={{
          'aria-label': label,
        }}
      />
    </Tooltip>
  );
};
