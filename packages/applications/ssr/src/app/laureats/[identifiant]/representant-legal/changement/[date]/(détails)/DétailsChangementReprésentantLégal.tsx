import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';
import { DétailsDemande } from '@/components/organisms/demande/DétailsDemande';

import { getTypeReprésentantLégalLabel } from '../../../_helpers/getTypeReprésentantLégalLabel';

import { DétailsChangementReprésentantLégalPageProps } from './DétailsChangementReprésentantLégal.page';

type DétailsChangementReprésentantLégalProps =
  DétailsChangementReprésentantLégalPageProps['demande'];

export const DétailsChangementReprésentantLégal: FC<DétailsChangementReprésentantLégalProps> = (
  demande,
) => {
  return demande.statut.statut === 'information-enregistrée' ? (
    <DétailsChangement
      title="Changement de représentant légal"
      valeurs={
        <DétailsValeursReprésentantLégal
          nomReprésentantLégal={demande.nomReprésentantLégal}
          typeReprésentantLégal={demande.typeReprésentantLégal.type}
        />
      }
      changement={{
        enregistréPar: demande.demandéePar,
        enregistréLe: demande.demandéeLe,
        pièceJustificative: demande.pièceJustificative,
      }}
      statut="information-enregistrée"
    />
  ) : (
    <DétailsDemande
      demande={demande}
      valeurs={
        <DétailsValeursReprésentantLégal
          nomReprésentantLégal={demande.nomReprésentantLégal}
          typeReprésentantLégal={demande.typeReprésentantLégal.type}
        />
      }
      statut={demande.statut.statut}
      title="Changement de représentant légal"
    />
  );
};

type DétailsValeursReprésentantLégalProps = PlainType<{
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  nomReprésentantLégal: string;
}>;

const DétailsValeursReprésentantLégal = ({
  typeReprésentantLégal,
  nomReprésentantLégal,
}: DétailsValeursReprésentantLégalProps) => (
  <>
    <div>
      <span className="font-medium">Type :</span>{' '}
      {getTypeReprésentantLégalLabel(typeReprésentantLégal)}
    </div>
    <div>
      <span className="font-medium">Nom représentant légal :</span> {nomReprésentantLégal}
    </div>
  </>
);
