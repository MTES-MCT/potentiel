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

    const { producteur } = await getProducteurInfos(identifiantProjet.formatter());

    const action = await getAction({
      identifiantProjet,
      rôle,
      domain: 'producteur',
    });

    return (
      <Section title="Producteur">
        <ProducteurDétails value={producteur} action={action} />
      </Section>
    );
  });
