import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { ProducteurDétails } from './ProducteurDétails';
import { notFound } from 'next/navigation';
import { checkAutorisationChangement } from '../../../../_helpers/checkAutorisationChangement';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Section } from '../../../(components)/Section';

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

    const { peutModifier, peutEnregistrerChangement } =
      await checkAutorisationChangement<'producteur'>({
        identifiantProjet,
        rôle,
        domain: 'producteur',
      });

    const action = peutModifier
      ? {
          url: Routes.Producteur.modifier(identifiantProjet.formatter()),
          label: 'Modifier',
          labelActions: 'Modifier le producteur',
        }
      : peutEnregistrerChangement
        ? {
            url: Routes.Producteur.changement.enregistrer(identifiantProjet.formatter()),
            label: 'Changer de producteur',
            labelActions: 'Changer de producteur',
          }
        : undefined;

    return (
      <Section title="Producteur">
        <ProducteurDétails value={mapToPlainObject(projection)} action={action} />
      </Section>
    );
  });
