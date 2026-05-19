import { notFound } from 'next/navigation';

import { IdentifiantProjet, type Éliminé } from '@potentiel-domain/projet';

import { Section } from '@/components/atoms/menu/Section';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getRecours } from '../../../../_helpers/getRecours';
import { getÉliminé } from '../../../../_helpers/getÉliminé';
import { EtapesProjet, type ÉtapeProjet } from './ÉtapesProjet';

type ÉtapesProjetSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Étapes du projet';

export const ÉtapesProjetSection = ({
  identifiantProjet: identifiantProjetValue,
}: ÉtapesProjetSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
      const recours = await getRecours(identifiantProjet.formatter());
      const éliminé = await getÉliminé(identifiantProjet.formatter());

      if (!éliminé) {
        return notFound();
      }

      const étapes = mapToÉtapesData({
        éliminé,
        recours,
      });

      return (
        <Section title={sectionTitle} className="min-w-0">
          <EtapesProjet
            étapes={étapes}
            identifiantProjet={identifiantProjetValue}
            doitAfficherAttestationDésignation={!!éliminé.attestationDésignation}
          />
        </Section>
      );
    }),
    sectionTitle,
  );

type GetÉtapesData = {
  éliminé: Éliminé.ConsulterÉliminéReadModel;
  recours?: Éliminé.Recours.ConsulterRecoursReadModel;
};

const mapToÉtapesData = ({ éliminé, recours }: GetÉtapesData) => {
  const étapes: Array<ÉtapeProjet> = [
    {
      type: 'designation',
      date: éliminé.notifiéLe.formatter(),
    },
  ];

  if (recours?.statut.estEnCours()) {
    étapes.push({
      type: 'recours-demandé',
      date: recours.dateDemande.formatter(),
    });
  }

  if (recours?.statut.estAnnulé()) {
    étapes.push({
      type: 'recours-annulé',
      date: recours.dateDemande.formatter(),
    });
  }

  if (recours?.statut.estRejeté()) {
    étapes.push({
      type: 'recours-rejeté',
      date: recours.dateDemande.formatter(),
    });
  }

  const étapesAvecDateSorted: Array<ÉtapeProjet> = étapes
    .filter((a): a is ÉtapeProjet & { date: NonNullable<ÉtapeProjet['date']> } => !!a.date)
    .sort((a, b) => a.date.localeCompare(b.date));

  const étapesSansDate: Array<ÉtapeProjet> = étapes.filter(
    (a): a is ÉtapeProjet & { date: undefined } => a.date === undefined,
  );

  return étapesAvecDateSorted.concat(étapesSansDate);
};
