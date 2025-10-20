import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';
import { DétailsDemande } from '@/components/organisms/demande/DétailsDemande';

import { DétailsPuissancePageProps } from './DétailsPuissance.page';

export type DétailsChangementPuissanceProps = {
  demande: DétailsPuissancePageProps['demande'];
  unitéPuissance: DétailsPuissancePageProps['unitéPuissance'];
  puissanceInitiale: DétailsPuissancePageProps['puissanceInitiale'];
};

export const DétailsChangementPuissance: FC<DétailsChangementPuissanceProps> = ({
  demande,
  unitéPuissance,
  puissanceInitiale,
}) => {
  const statut = Lauréat.Puissance.StatutChangementPuissance.bind(demande.statut.statut);

  return statut.estInformationEnregistrée() ? (
    <DétailsChangement
      title="Changement de puissance"
      détailsValeursDuDomaine={
        <DétailsValeursPuissance
          unitéPuissance={unitéPuissance}
          puissanceInitiale={puissanceInitiale}
          nouvellePuissance={demande.nouvellePuissance}
        />
      }
      changement={{
        enregistréPar: demande.demandéePar,
        enregistréLe: demande.demandéeLe,
        raison: demande.raison,
        pièceJustificative: demande.pièceJustificative,
      }}
      statut="information-enregistrée"
    />
  ) : (
    <DétailsDemande
      demande={demande}
      détailsValeursDuDomaine={
        <DétailsValeursPuissance
          unitéPuissance={unitéPuissance}
          puissanceInitiale={puissanceInitiale}
          nouvellePuissance={demande.nouvellePuissance}
        />
      }
      statut={demande.statut.statut}
      title="Demande de changement de puissance"
    />
  );
};

type DétailsValeursPuissanceProps = {
  unitéPuissance: DétailsChangementPuissanceProps['unitéPuissance'];
  puissanceInitiale: DétailsChangementPuissanceProps['puissanceInitiale'];
  nouvellePuissance: DétailsPuissancePageProps['demande']['nouvellePuissance'];
};

const DétailsValeursPuissance = ({
  unitéPuissance,
  puissanceInitiale,
  nouvellePuissance,
}: DétailsValeursPuissanceProps) => (
  <>
    <div>
      <span className="font-medium">Puissance demandée</span> : {nouvellePuissance} {unitéPuissance}
    </div>
    <div>
      <span className="font-medium">Puissance initiale</span> : {puissanceInitiale} {unitéPuissance}
    </div>
  </>
);
