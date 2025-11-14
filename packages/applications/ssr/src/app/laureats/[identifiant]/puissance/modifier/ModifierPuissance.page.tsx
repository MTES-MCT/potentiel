import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import { ModifierPuissanceForm, ModifierPuissanceFormProps } from './ModifierPuissance.form';

export type ModifierPuissancePageProps = ModifierPuissanceFormProps;

export const ModifierPuissancePage: FC<ModifierPuissancePageProps> = ({
  identifiantProjet,
  puissance,
  unitéPuissance,
  puissanceDeSite,
  infosCahierDesChargesPuissanceDeSite,
}) => (
  <>
    <Heading1>Changer la puissance</Heading1>
    <ModifierPuissanceForm
      identifiantProjet={identifiantProjet}
      puissance={puissance}
      unitéPuissance={unitéPuissance}
      puissanceDeSite={puissanceDeSite}
      infosCahierDesChargesPuissanceDeSite={infosCahierDesChargesPuissanceDeSite}
    />
  </>
);
