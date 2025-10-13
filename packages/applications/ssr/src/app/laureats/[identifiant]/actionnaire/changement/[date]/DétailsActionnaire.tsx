import { FC } from 'react';

import { DétailsChangementActionnairePageProps } from './DétailsChangementActionnaire.page';

export const DétailsActionnaire: FC<{
  nouvelActionnaire: DétailsChangementActionnairePageProps['demande']['nouvelActionnaire'];
}> = ({ nouvelActionnaire }) => (
  <div>
    <span className="font-medium">Nouvel actionnaire :</span> {nouvelActionnaire}
  </div>
);
