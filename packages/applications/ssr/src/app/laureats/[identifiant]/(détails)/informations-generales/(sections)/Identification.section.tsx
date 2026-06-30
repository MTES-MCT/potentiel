import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getProducteurInfos } from '@/app/laureats/[identifiant]/_helpers';
import { Section } from '@/components/atoms/section/Section';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { IdentificationDétails } from './IdentificationDétails';

type IdentificationProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const IdentificationSection = ({
  identifiantProjet: identifiantProjetValue,
}: IdentificationProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const producteur = await getProducteurInfos(identifiantProjet.formatter());

    // cas particulier pour producteur pour le moment, à ne pas intégrer à getAction IMO
    const action = rôle.aLaPermission('producteur.corrigerNuméroIdentification')
      ? {
          url: Routes.Producteur.numéroIdentification.corriger(identifiantProjet.formatter()),
          label: `${producteur.numéroIdentification ? 'Corriger' : 'Renseigner'} le numéro d'identification`,
        }
      : undefined;

    return (
      <Section title="Identification">
        <IdentificationDétails value={producteur.numéroIdentification} action={action} />
      </Section>
    );
  });
