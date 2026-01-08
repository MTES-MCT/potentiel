import { FC } from 'react';

import { ReadMore } from '../ReadMore';

type DisplayRaisonChangementProps = { raison: string | undefined };

export const DisplayRaisonChangement: FC<DisplayRaisonChangementProps> = ({ raison }) => {
  if (!raison || raison === '') {
    return;
  }

  return (
    <div>
      Raison : <ReadMore text={raison} />
    </div>
  );
};
