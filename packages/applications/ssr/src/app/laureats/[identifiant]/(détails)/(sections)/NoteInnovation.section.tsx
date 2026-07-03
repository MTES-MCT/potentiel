import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { type Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCahierDesCharges } from '../../../../_helpers';
import { NoteInnovationDétails } from './NoteInnovationDétails';

type NoteInnovationSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = "Résultats de l'appel d'offres";

export const NoteInnovationSection = ({
  identifiantProjet: identifiantProjetValue,
}: NoteInnovationSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());
      if (
        cahierDesCharges.appelOffre.typeAppelOffre !== 'innovation' ||
        !rôle.aLaPermission('candidature.consulterDétail') ||
        !rôle.aLaPermission('candidature.consulter')
      ) {
        return null;
      }

      const notes = await getNotes(identifiantProjet.formatter());

      return (
        <Section title={sectionTitle}>
          <NoteInnovationDétails
            noteTotale={notes.noteTotale}
            notePrix={notes.notePrix}
            notesInnovation={notes.notesInnovation}
          />
        </Section>
      );
    }),
    sectionTitle,
  );

const getNotes = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const détailsCandidature = await mediator.send<Candidature.ConsulterDétailCandidatureQuery>({
    type: 'Candidature.Query.ConsulterDétailCandidature',
    data: {
      identifiantProjet: identifiantProjet,
    },
  });

  if (Option.isNone(détailsCandidature)) {
    return notFound();
  }

  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet: identifiantProjet,
    },
  });

  if (Option.isNone(candidature)) {
    return notFound();
  }
  return {
    noteTotale: formatterNote(candidature.instruction.noteTotale),
    notePrix: formatterNote(détailsCandidature.détail.notePrix),
    notesInnovation: {
      note: formatterNote(détailsCandidature.détail.innovation?.note),
      degréInnovation: formatterNote(
        détailsCandidature.détail.innovation?.noteDegréInnovationSur20,
      ),
      positionnement: formatterNote(
        détailsCandidature.détail.innovation?.notePositionnementSurLeMarchéSur10,
      ),
      qualitéTechnique: formatterNote(
        détailsCandidature.détail.innovation?.noteQualitéTechniqueSur5,
      ),
      adéquationAmbitionsIndustrielles: formatterNote(
        détailsCandidature.détail.innovation?.noteAdéquationAmbitionsIndustriellesSur5,
      ),
      aspectsEnvironnementauxEtSociaux: formatterNote(
        détailsCandidature.détail.innovation?.noteAspectsEnvironnementauxEtSociauxSur5,
      ),
    },
  };
};

const formatterNote = (note?: number) => (note ? (Math.round(note * 100) / 100).toString() : 'N/A');
