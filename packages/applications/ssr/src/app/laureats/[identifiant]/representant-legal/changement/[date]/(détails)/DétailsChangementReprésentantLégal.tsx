import { FC } from 'react';
import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';
import { DétailsDemande } from '@/components/organisms/demande/DétailsDemande';

import { InfoBoxDemandeEnCours } from './InfoBoxDemandeEnCours';

type DétailsChangementReprésentantLégalProps =
  PlainType<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel> & {
    identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
    dateDemandeEnCoursPourLien?: string;
  };

export const DétailsChangementReprésentantLégal: FC<DétailsChangementReprésentantLégalProps> = ({
  identifiantProjet,
  demande,
  dateDemandeEnCoursPourLien,
}) => {
  const idProjet = IdentifiantProjet.bind(identifiantProjet).formatter();

  return demande.statut.statut === 'information-enregistrée' ? (
    <DétailsChangement
      title="Changement de représentant légal"
      détailsValeursDuDomaine={
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
      détailsValeursDuDomaine={
        <DétailsValeursReprésentantLégal
          nomReprésentantLégal={demande.nomReprésentantLégal}
          typeReprésentantLégal={demande.typeReprésentantLégal.type}
          idProjet={idProjet}
          dateDemandeEnCoursPourLien={dateDemandeEnCoursPourLien}
        />
      }
      statut={demande.statut.statut}
      title="Changement de représentant légal"
    />
  );
};

const getTypeLabel = (type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType) =>
  match(type)
    .returnType<string>()
    .with('personne-physique', () => 'Personne physique')
    .with('personne-morale', () => 'Personne morale')
    .with('collectivité', () => 'Collectivité')
    .with('autre', () => 'Organisme')
    .with('inconnu', () => 'Inconnu')
    .exhaustive();

type Props = PlainType<{
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  nomReprésentantLégal: string;
  idProjet?: string;
  dateDemandeEnCoursPourLien?: string;
}>;

const DétailsValeursReprésentantLégal = ({
  typeReprésentantLégal,
  nomReprésentantLégal,
  idProjet,
  dateDemandeEnCoursPourLien,
}: Props) => (
  <div>
    {dateDemandeEnCoursPourLien && idProjet && (
      <InfoBoxDemandeEnCours
        lien={Routes.ReprésentantLégal.changement.détails(idProjet, dateDemandeEnCoursPourLien)}
      />
    )}
    <div>
      <span className="font-medium">Type :</span> {getTypeLabel(typeReprésentantLégal)}
    </div>
    <div>
      <span className="font-medium">Nom représentant légal :</span> {nomReprésentantLégal}
    </div>
  </div>
);
