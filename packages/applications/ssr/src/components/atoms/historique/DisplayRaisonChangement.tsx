import type { FC } from 'react';

import { ReadMore } from '../ReadMore';

type DisplayRaisonChangementProps = { raison: string | undefined; className?: string };

export const DisplayRaisonChangement: FC<DisplayRaisonChangementProps> = ({
  raison,
  className,
}) => {
  if (!raison || raison === '') {
    return;
  }

  return (
    <div>
      <span className={className}>Raison</span> : <ReadMore text={raison} />
    </div>
  );
};
