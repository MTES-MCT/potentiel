import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { CahierDesCharges, Lauréat } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Heading1 } from '@/components/atoms/headings';

import { DemanderChangementPuissanceForm } from './DemanderChangementPuissance.form';

export type DemanderChangementPuissancePageProps = PlainType<
  Lauréat.Puissance.ConsulterPuissanceReadModel & {
    cahierDesCharges: PlainType<CahierDesCharges.ValueType>;
    volumeRéservé?: PlainType<Lauréat.Puissance.VolumeRéservé.ValueType>;
    infosCahierDesChargesPuissanceDeSite: AppelOffre.ChampsSupplémentairesCandidature['puissanceDeSite'];
  }
>;

export const DemanderChangementPuissancePage: FC<DemanderChangementPuissancePageProps> = ({
  identifiantProjet,
  puissance,
  puissanceDeSite,
  cahierDesCharges,
  volumeRéservé,
  unitéPuissance,
  puissanceInitiale,
  infosCahierDesChargesPuissanceDeSite,
}) => (
  <>
    <Heading1>Changer de puissance</Heading1>
    <DemanderChangementPuissanceForm
      identifiantProjet={identifiantProjet}
      puissance={puissance}
      puissanceDeSite={puissanceDeSite}
      cahierDesCharges={cahierDesCharges}
      volumeRéservé={volumeRéservé}
      unitéPuissance={unitéPuissance}
      puissanceInitiale={puissanceInitiale}
      infosCahierDesChargesPuissanceDeSite={infosCahierDesChargesPuissanceDeSite}
    />
  </>
);
