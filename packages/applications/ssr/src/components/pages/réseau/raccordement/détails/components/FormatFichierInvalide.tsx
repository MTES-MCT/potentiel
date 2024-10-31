import { FC } from 'react';

import { Icon } from '@/components/atoms/Icon';

/**
 * @deprecated lié au problème de fichiers invalides uploadés dans raccordement,
 * cf query metabase "Liste dossiers avec fichier(s) invalide(s)"
 **/
export const FormatFichierInvalide: FC = () => (
  <div className="flex items-center gap-1">
    <Icon
      id="fr-icon-alert-fill"
      size="sm"
      className="text-theme-warning"
      title="format du fichier invalide"
    />
    <p className="text-xs">Le format du fichier est invalide</p>
  </div>
);
