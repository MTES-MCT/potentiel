import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import {
  getAction,
  getProducteurInfos,
  peutEffectuerUnChangement,
} from '@/app/laureats/[identifiant]/_helpers';
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

    const producteurInfos = await getProducteurInfos(identifiantProjet.formatter());

    const actionProducteur = await getAction({
      identifiantProjet,
      rôle,
      domain: 'producteur',
    });

    const peutCorrigerNuméroIdentification =
      rôle.aLaPermission('producteur.numéroIdentification.corriger') &&
      (await peutEffectuerUnChangement(identifiantProjet));

    return (
      <Section title="Producteur">
        <ProducteurDétails
          producteur={{
            value: producteurInfos.producteur,
            action: actionProducteur,
          }}
          numéroIdentification={{
            value: producteurInfos.numéroIdentification,
            action: peutCorrigerNuméroIdentification
              ? {
                  url: Routes.Producteur.numéroIdentification.corriger(
                    identifiantProjet.formatter(),
                  ),
                  label: `${producteurInfos.numéroIdentification ? 'Corriger' : 'Renseigner'} le numéro d'identification`,
                }
              : undefined,
          }}
        />
      </Section>
    );
  });
