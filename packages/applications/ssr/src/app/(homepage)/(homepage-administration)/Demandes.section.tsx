import { mediator } from 'mediateur';

import type { PotentielUtilisateur } from '@potentiel-applications/request-context';
import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DemandesDétails } from './Demandes.détails';

type DemandesSectionProps = {
  utilisateur: PotentielUtilisateur;
};

const sectionTitle = 'Demandes';
export const DemandesSection = ({ utilisateur }: DemandesSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async () => {
      const demandes = await getDemandes(utilisateur);

      return (
        <Section title={sectionTitle}>
          <DemandesDétails demandes={demandes} />
        </Section>
      );
    }),
    sectionTitle,
  );

const getDemandes = async (utilisateur: PotentielUtilisateur) => {
  const ilYAUnMois = DateTime.now().retirerNombreDeMois(1);
  const abandons = await mediator.send<Lauréat.Abandon.ListerDemandesAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ListerDemandesAbandon',
    data: {
      utilisateur: utilisateur.identifiantUtilisateur.email,
      statut: ['confirmé', 'confirmation-demandée', 'demandé', 'en-instruction'],
      autoritéCompétente: 'dreal',
    },
  });

  const demandeActionnaire =
    await mediator.send<Lauréat.Actionnaire.ListerChangementActionnaireQuery>({
      type: 'Lauréat.Actionnaire.Query.ListerChangementActionnaire',
      data: {
        utilisateur: utilisateur.identifiantUtilisateur.email,
        statut: ['demandé'],
      },
    });

  const demandeReprésentantLégal =
    await mediator.send<Lauréat.ReprésentantLégal.ListerChangementReprésentantLégalQuery>({
      type: 'Lauréat.ReprésentantLégal.Query.ListerChangementReprésentantLégal',
      data: {
        utilisateur: utilisateur.identifiantUtilisateur.email,
        statut: ['demandé'],
      },
    });

  const demandePuissance = await mediator.send<Lauréat.Puissance.ListerChangementPuissanceQuery>({
    type: 'Lauréat.Puissance.Query.ListerChangementPuissance',
    data: {
      utilisateur: utilisateur.identifiantUtilisateur.email,
      statut: ['demandé'],
    },
  });

  return {
    abandon: {
      total: abandons.total,
      new: abandons.items.filter((demande) => demande.dateDemande.estUltérieureÀ(ilYAUnMois))
        .length,
    },
    actionnaire: {
      total: demandeActionnaire.total,
      new: demandeActionnaire.items.filter((demande) =>
        demande.demandéLe.estUltérieureÀ(ilYAUnMois),
      ).length,
    },
    représentantLégal: {
      total: demandeReprésentantLégal.total,
      new: demandeReprésentantLégal.items.filter((demande) =>
        demande.demandéLe.estUltérieureÀ(ilYAUnMois),
      ).length,
    },
    puissance: {
      total: demandePuissance.total,
      new: demandePuissance.items.filter((demande) => demande.demandéLe.estUltérieureÀ(ilYAUnMois))
        .length,
    },
    délai: {
      total: 0,
      new: 0,
    },
    recours: {
      total: 0,
      new: 0,
    },
  };
};
