import { faker } from '@faker-js/faker';

import type { PlainType } from '@potentiel-domain/core';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { IdentifiantProjet } from '@potentiel-domain/projet';

type GetFakeIdentifiantProjetProps = Partial<PlainType<IdentifiantProjet.ValueType>>;
export const getFakeIdentifiantProjet = (props: GetFakeIdentifiantProjetProps = {}): string => {
  const numéroCRE = props.numéroCRE ?? faker.number.int().toString();

  const appelOffre = props.appelOffre
    ? appelsOffreData.find((ao) => ao.id === props.appelOffre)
    : // L'AO Petit PV Bâtiment (AO Simplifié) a des règles trop différentes pour être choisi aléatoirement (GF par exemple).
      faker.helpers.arrayElement(
        appelsOffreData.filter((x) => x.id !== 'PPE2 - Petit PV Bâtiment'),
      );

  if (!appelOffre) {
    if (!!props.appelOffre && !!props.période) {
      return IdentifiantProjet.bind({
        appelOffre: props.appelOffre,
        période: props.période,
        famille: props.famille ?? '',
        numéroCRE,
      }).formatter();
    }
    throw new Error("Appel d'offre non trouvé");
  }

  const période = props.période
    ? appelOffre.periodes.find((p) => p.id === props.période)
    : faker.helpers.arrayElement(appelOffre.periodes);
  if (!période) {
    if (!!props.appelOffre && !!props.période) {
      return IdentifiantProjet.bind({
        appelOffre: props.appelOffre,
        période: props.période,
        famille: props.famille ?? '',
        numéroCRE,
      }).formatter();
    }
    throw new Error('Période non trouvée');
  }

  const famille = props.famille
    ? props.famille
    : période.familles.length > 0
      ? faker.helpers.maybe(() => faker.helpers.arrayElement(période.familles))?.id
      : undefined;

  return IdentifiantProjet.bind({
    appelOffre: appelOffre.id,
    période: période.id,
    famille: famille ?? '',
    numéroCRE,
  }).formatter();
};
