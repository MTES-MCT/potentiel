import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import Notice from '@codegouvfr/react-dsfr/Notice';

import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';
import { DocumentItem } from '@/components/organisms/document/DocumentListItem';
import { DocumentsList } from '@/components/organisms/document/DocumentsList';

import { getRecours, getÉliminé } from '../../../../../_helpers';

type DocumentsSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Documents';
export const DocumentsSection = ({ identifiantProjet }: DocumentsSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const documents: Array<DocumentItem> = [];

      const éliminé = await getÉliminé(identifiantProjet);

      if (!éliminé) {
        return notFound();
      }

      // ATTESTATION
      if (éliminé.attestationDésignation) {
        documents.push({
          type: 'Avis de rejet',
          date: éliminé.attestationDésignation.dateCréation,
          format: éliminé.attestationDésignation.format,
          documentKey: éliminé.attestationDésignation.formatter(),
          peutÊtreTéléchargé: true,
        });
      }

      // EXPORT ELIMINÉS
      documents.push({
        type: 'Export des données du projet',
        date: DateTime.now().formatter(),
        format: 'csv',
        url: Routes.Éliminé.exporter({ nomProjet: éliminé.nomProjet }),
        peutÊtreTéléchargé: rôle.aLaPermission('lauréat.listerLauréatEnrichi'),
      });

      const recours = await getRecours(identifiantProjet);

      // RECOURS
      if (recours) {
        const demandeRecours = await mediator.send<Éliminé.Recours.ConsulterDemandeRecoursQuery>({
          type: 'Éliminé.Recours.Query.ConsulterDemandeRecours',
          data: {
            identifiantProjetValue: identifiantProjet,
            dateDemandeValue: recours.dateDemande.formatter(),
          },
        });

        if (Option.isNone(demandeRecours)) {
          return notFound();
        }

        if (demandeRecours.demande.pièceJustificative) {
          documents.push({
            type: 'Pièce(s) justificative(s) de la demande de recours',
            date: demandeRecours.demande.pièceJustificative.dateCréation,
            format: demandeRecours.demande.pièceJustificative.format,
            documentKey: demandeRecours.demande.pièceJustificative.formatter(),
            demande: {
              date: demandeRecours.demande.demandéLe.formatter(),
            },
            peutÊtreTéléchargé: true,
          });
        }

        if (demandeRecours.demande.rejet) {
          documents.push({
            type: 'Réponse signée du rejet de la demande de recours',
            date: demandeRecours.demande.rejet.réponseSignée.dateCréation,
            format: demandeRecours.demande.rejet.réponseSignée.format,
            documentKey: demandeRecours.demande.rejet.réponseSignée.formatter(),
            peutÊtreTéléchargé: true,
          });
        }
      }

      return (
        <>
          <Notice
            title="À propos"
            description={
              <span>Retrouvez dans cette section les documents essentiels de votre projet</span>
            }
            severity="info"
          />
          <DocumentsList documents={documents.toSorted((a, b) => b.date.localeCompare(a.date))} />
        </>
      );
    }),
    sectionTitle,
  );
