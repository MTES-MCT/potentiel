import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getAction } from '@/app/laureats/[identifiant]/_helpers/getAction';

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

    const projection = await mediator.send<Lauréat.Producteur.ConsulterProducteurQuery>({
      type: 'Lauréat.Producteur.Query.ConsulterProducteur',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    if (Option.isNone(projection)) {
      return notFound();
    }

    const action = await getAction({
      identifiantProjet,
      rôle,
      domain: 'producteur',
    });

    return (
      <Section title="Producteur">
        <ProducteurDétails value={mapToPlainObject(projection)} action={action} />
      </Section>
    );
  });
