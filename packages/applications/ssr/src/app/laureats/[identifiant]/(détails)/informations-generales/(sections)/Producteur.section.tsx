import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getAction, getProducteurInfos } from '@/app/laureats/[identifiant]/_helpers';
import { Section } from '@/components/atoms/section/Section';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { ProducteurDétails } from './ProducteurDétails';

type ProducteurSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const ProducteurSection = ({
  identifiantProjet: identifiantProjetValue,
}: ProducteurSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const producteur = await getProducteurInfos(identifiantProjet.formatter());

    const actions = [];

    const actionProducteur = await getAction({
      identifiantProjet,
      rôle,
      domain: 'producteur',
    });

    if (actionProducteur) {
      actions.push(actionProducteur);
    }

    // cas particulier pour producteur pour le moment, à ne pas intégrer à getAction IMO
    if (rôle.aLaPermission('producteur.corrigerNuméroIdentification')) {
      actions.push({
        url: Routes.Producteur.numéroIdentification.corriger(identifiantProjet.formatter()),
        label: "Corriger le numéro d'identification",
      });
    }

    return (
      <Section title="Producteur">
        <ProducteurDétails value={mapToPlainObject(producteur)} actions={actions} />
      </Section>
    );
  });
