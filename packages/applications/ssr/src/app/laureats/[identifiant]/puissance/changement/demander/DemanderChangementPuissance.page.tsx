import type { FC } from 'react';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { PlainType } from '@potentiel-domain/core';
import type { CahierDesCharges, Lauréat } from '@potentiel-domain/projet';

import { Heading1 } from '@/components/atoms/headings';
import { DemanderChangementPuissanceForm } from './DemanderChangementPuissance.form';

export type DemanderChangementPuissancePageProps = PlainType<
  Omit<Lauréat.Puissance.ConsulterPuissanceReadModel, 'aUneDemandeEnCours'> & {
    cahierDesCharges: PlainType<CahierDesCharges.ValueType>;
    infosCahierDesChargesPuissanceDeSite: AppelOffre.ChampsSupplémentairesCandidature['puissanceDeSite'];
    estDansLeVolumeRéservé: boolean | undefined;
  }
>;

export const DemanderChangementPuissancePage: FC<DemanderChangementPuissancePageProps> = ({
  identifiantProjet,
  puissance,
  puissanceDeSite,
  cahierDesCharges,
  unitéPuissance,
  puissanceInitiale,
  infosCahierDesChargesPuissanceDeSite,
  estDansLeVolumeRéservé,
}) => (
  <>
    <Heading1>Changer de puissance</Heading1>
    <DemanderChangementPuissanceForm
      identifiantProjet={identifiantProjet}
      puissance={puissance}
      puissanceDeSite={puissanceDeSite}
      cahierDesCharges={cahierDesCharges}
      unitéPuissance={unitéPuissance}
      puissanceInitiale={puissanceInitiale}
      infosCahierDesChargesPuissanceDeSite={infosCahierDesChargesPuissanceDeSite}
      estDansLeVolumeRéservé={estDansLeVolumeRéservé}
    />
  </>
);
