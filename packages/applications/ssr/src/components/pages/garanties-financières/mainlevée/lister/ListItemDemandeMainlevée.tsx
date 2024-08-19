import { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Routes } from '@potentiel-applications/routes';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { StatutMainlevéeBadge } from '@/components/molecules/mainlevée/StatutMainlevéeBadge';
import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';

import { convertMotifMainlevéeForView } from '../convertForView';

export type ListItemDemandeMainlevéeProps = {
  demandéLe: Iso8601DateTime;
  identifiantProjet: string;
  statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
  misÀJourLe: Iso8601DateTime;
  motif: string;
  nomProjet: string;
  showInstruction: boolean;
};

export const ListItemDemandeMainlevée: FC<ListItemDemandeMainlevéeProps> = ({
  demandéLe,
  identifiantProjet,
  misÀJourLe,
  motif,
  nomProjet,
  statut,
  showInstruction,
}) => (
  <div className="w-full">
    <ProjectListItemHeading
      identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
      prefix="Mainlevée du projet"
      nomProjet={nomProjet}
      misÀJourLe={misÀJourLe}
    />
    <div className="flex flex-col gap-1 mt-1">
      <StatutMainlevéeBadge statut={statut} />
      <ul className="mt-3 text-sm">
        <li>
          <span>
            Motif :{' '}
            <span className="font-semibold capitalize">{convertMotifMainlevéeForView(motif)}</span>
          </span>
        </li>
        <li>
          <span>
            Date de la demande : <FormattedDate className="font-semibold" date={demandéLe} />
          </span>
        </li>
      </ul>
    </div>
    {showInstruction && (
      <a
        href={Routes.GarantiesFinancières.détail(identifiantProjet)}
        className="self-end mt-2"
        aria-label={`instruire`}
      >
        Instruire
      </a>
    )}
  </div>
);
