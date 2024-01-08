import { FC } from 'react';
import { encodeUrl } from '@/utils/encodeUrl';

type TâcheTransmettrePreuveRecandidatureListItemProps = {
  identifiantProjet: string;
  misÀJourLe: string;
  typeTâche: string;
};

export const TâcheTransmettrePreuveRecandidatureListItem: FC<
  TâcheTransmettrePreuveRecandidatureListItemProps
> = ({ identifiantProjet, misÀJourLe }) => (
  <>
    <div className="flex flex-col justify-between mt-4 md:mt-2">
      <p className="italic text-sm">dernière mise à jour le {misÀJourLe}</p>
      <a
        href={encodeUrl('/laureats/:identifiantProjet/abandon', { identifiantProjet })}
        className="self-end mt-2"
        aria-label={`voir`}
      >
        voir
      </a>
    </div>
  </>
);
