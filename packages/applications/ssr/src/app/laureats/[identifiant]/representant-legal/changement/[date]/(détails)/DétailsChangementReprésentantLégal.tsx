import { FC } from 'react';
import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';
import { DétailsDemande } from '@/components/organisms/demande/DétailsDemande';

import { DétailsChangementReprésentantLégalPageProps } from './DétailsChangementReprésentantLégal.page';

type DétailsChangementReprésentantLégalProps =
  DétailsChangementReprésentantLégalPageProps['demande'];

export const DétailsChangementReprésentantLégal: FC<DétailsChangementReprésentantLégalProps> = (
  demande,
) =>
  demande.statut.statut === 'information-enregistrée' ? (
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

const getTypeLabel = (type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType) =>
  match(type)
    .returnType<string>()
    .with('personne-physique', () => 'Personne physique')
    .with('personne-morale', () => 'Personne morale')
    .with('collectivité', () => 'Collectivité')
    .with('autre', () => 'Organisme')
    .with('inconnu', () => 'Inconnu')
    .exhaustive();

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
      <span className="font-medium">Type :</span> {getTypeLabel(typeReprésentantLégal)}
    </div>
    <div>
      <span className="font-medium">Nom représentant légal :</span> {nomReprésentantLégal}
    </div>
  </>
);
