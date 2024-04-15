import { FC } from 'react';
import { fr } from '@codegouvfr/react-dsfr';

import { Icon } from '@/components/atoms/Icon';

export const FormatFichierInvalide: FC = () => (
  <div className="flex items-center gap-1">
    <Icon
      id="fr-icon-alert-fill"
      size="sm"
      style={{
        color: fr.colors.decisions.text.default.warning.default,
      }}
      title="format du fichier invalide"
    />
    <p className="text-xs">Le format du fichier est invalide</p>
  </div>
);
