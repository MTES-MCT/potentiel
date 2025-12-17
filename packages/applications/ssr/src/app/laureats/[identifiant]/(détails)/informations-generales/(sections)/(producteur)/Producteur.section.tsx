import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getAction } from '@/app/laureats/[identifiant]/_helpers/getAction';
import { getProducteurInfos } from '@/app/laureats/[identifiant]/_helpers/getLauréat';

import { Section } from '../../../(components)/Section';

import { ProducteurDétails } from './ProducteurDétails';

type ProducteurSectionProps = {
  identifiantProjet: string;
};

export const ProducteurSection = ({
  identifiantProjet: identifiantProjetValue,
}: ProducteurSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const producteur = await getProducteurInfos(identifiantProjet.formatter());

    const action = await getAction({
      identifiantProjet,
      rôle,
      domain: 'producteur',
    });

    return (
      <Section title="Producteur">
        <ProducteurDétails value={mapToPlainObject(producteur)} action={action} />
      </Section>
    );
  });
