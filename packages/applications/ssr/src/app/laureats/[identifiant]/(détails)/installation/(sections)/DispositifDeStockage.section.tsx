import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '@/app/_helpers';
import { getAction, getInstallationInfos } from '@/app/laureats/[identifiant]/_helpers';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { Champ } from '@/components/atoms/section/Champ';
import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

type DispositifDeStockageSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Dispositif de stockage';

export const DispositifDeStockageSection = ({
  identifiantProjet: identifiantProjetValue,
}: DispositifDeStockageSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

      const { dispositifDeStockage: champSupplémentaireDispositifDeStockage } =
        cahierDesCharges.getChampsSupplémentaires();

      if (!champSupplémentaireDispositifDeStockage) {
        return null;
      }

      const installation = await getInstallationInfos(identifiantProjet.formatter());

      const action = await getAction({
        identifiantProjet,
        rôle,
        domain: 'dispositifDeStockage',
      });

      const value = installation?.dispositifDeStockage
        ? mapToPlainObject(installation.dispositifDeStockage)
        : undefined;

      return (
        <Section title={sectionTitle}>
          {value ? (
            <>
              <div>
                {value.installationAvecDispositifDeStockage
                  ? 'Installation couplée à un dispositif de stockage'
                  : 'Installation sans dispositif de stockage'}
              </div>
              {value.puissanceDuDispositifDeStockageEnKW !== undefined && (
                <Champ
                  label="Puissance du dispositif de stockage"
                  number={value.puissanceDuDispositifDeStockageEnKW}
                  unité="kW"
                />
              )}
              {value.capacitéDuDispositifDeStockageEnKWh !== undefined && (
                <Champ
                  label="Capacité du dispositif de stockage"
                  number={value.capacitéDuDispositifDeStockageEnKWh}
                  unité="kWh"
                />
              )}
            </>
          ) : (
            <div>Champ non renseigné</div>
          )}
          {action && <TertiaryLink href={action.url}>{action.label}</TertiaryLink>}
        </Section>
      );
    }),
    sectionTitle,
  );
