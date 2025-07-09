import { faker } from '@faker-js/faker';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { PlainType } from '@potentiel-domain/core';

type GetFakeIdentifiantProjetProps = Partial<PlainType<IdentifiantProjet.ValueType>>;
export const getFakeIdentifiantProjet = (props: GetFakeIdentifiantProjetProps = {}): string => {
  const numéroCRE = props.numéroCRE ?? faker.number.int().toString();

  const appelOffre = props.appelOffre
    ? appelsOffreData.find((ao) => ao.id === props.appelOffre)
    : faker.helpers.arrayElement(appelsOffreData);

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
