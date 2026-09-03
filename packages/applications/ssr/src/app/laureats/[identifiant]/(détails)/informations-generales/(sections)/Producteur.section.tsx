import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getLauréatInfos } from '@/app/_helpers';
import {
  getAction,
  getOptionalAbandon,
  getProducteurInfos,
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

    const lauréat = await getLauréatInfos(identifiantProjet.formatter());

    const abandon = await getOptionalAbandon(identifiantProjet.formatter());
    const actionProducteur = await getAction({
      identifiantProjet,
      rôle,
      domain: 'producteur',
    });

    const peutCorrigerNuméroIdentification =
      abandon?.statut.estEnCours() || lauréat.statut.estAbandonné() || lauréat.statut.estAchevé()
        ? rôle.aLaPermission('producteur.numéroIdentification.corriger-etat-abandon-achevement')
        : rôle.aLaPermission('producteur.numéroIdentification.corriger');

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
