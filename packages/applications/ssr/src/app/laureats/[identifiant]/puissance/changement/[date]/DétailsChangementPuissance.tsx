import type { FC } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';
import { DétailsDemande } from '@/components/organisms/demande/DétailsDemande';
import type { DétailsPuissancePageProps } from './DétailsPuissance.page';

export type DétailsChangementPuissanceProps = {
  demande: DétailsPuissancePageProps['demande'];
  unitéPuissance: DétailsPuissancePageProps['unitéPuissance'];
  puissanceInitiale: DétailsPuissancePageProps['puissanceInitiale'];
  statut: Lauréat.Puissance.StatutChangementPuissance.ValueType;
};

export const DétailsChangementPuissance: FC<DétailsChangementPuissanceProps> = ({
  demande,
  unitéPuissance,
  puissanceInitiale,
  statut,
}) => {
  return statut.estInformationEnregistrée() ? (
    <DétailsChangement
      valeurs={
        <DétailsValeursPuissance
          unitéPuissance={unitéPuissance}
          puissanceInitiale={puissanceInitiale}
          nouvellePuissance={demande.nouvellePuissance}
          nouvellePuissanceDeSite={demande.nouvellePuissanceDeSite}
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
      valeurs={
        <DétailsValeursPuissance
          unitéPuissance={unitéPuissance}
          puissanceInitiale={puissanceInitiale}
          nouvellePuissance={demande.nouvellePuissance}
          nouvellePuissanceDeSite={demande.nouvellePuissanceDeSite}
        />
      }
      statut={demande.statut.statut}
    />
  );
};

type DétailsValeursPuissanceProps = {
  unitéPuissance: DétailsChangementPuissanceProps['unitéPuissance'];
  puissanceInitiale: DétailsChangementPuissanceProps['puissanceInitiale'];
  nouvellePuissance: DétailsPuissancePageProps['demande']['nouvellePuissance'];
  nouvellePuissanceDeSite: DétailsPuissancePageProps['demande']['nouvellePuissanceDeSite'];
};

const DétailsValeursPuissance = ({
  unitéPuissance,
  puissanceInitiale,
  nouvellePuissance,
  nouvellePuissanceDeSite,
}: DétailsValeursPuissanceProps) => (
  <>
    {puissanceInitiale === nouvellePuissance ? (
      <div>La puissance n'a pas été modifiée.</div>
    ) : (
      <div>
        <span className="font-medium">Puissance demandée</span> : {nouvellePuissance}{' '}
        {unitéPuissance}
      </div>
    )}
    <div>
      <span className="font-medium">Puissance initiale</span> : {puissanceInitiale} {unitéPuissance}
    </div>
    {nouvellePuissanceDeSite !== undefined ? (
      <div>
        <span className="font-medium">Puissance de site </span> : {nouvellePuissanceDeSite}{' '}
        {unitéPuissance}
      </div>
    ) : null}
  </>
);
