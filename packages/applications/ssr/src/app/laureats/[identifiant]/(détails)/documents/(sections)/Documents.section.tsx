import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import Notice from '@codegouvfr/react-dsfr/Notice';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import {
  getAbandonInfos,
  getAchèvement,
  getLauréatInfos,
} from '@/app/laureats/[identifiant]/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';
import { DocumentItem } from '@/components/organisms/document/DocumentListItem';
import { DocumentsList } from '@/components/organisms/document/DocumentsList';

type DocumentsSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Documents';
export const DocumentsSection = ({ identifiantProjet }: DocumentsSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const documents: Array<DocumentItem> = [];

      const { nomProjet, attestationDésignation } = await getLauréatInfos(identifiantProjet);
      const abandon = await getAbandonInfos(identifiantProjet);

      // ATTESTATION
      if (attestationDésignation) {
        documents.push({
          type: attestationDésignation.typeDocument,
          date: attestationDésignation.dateCréation,
          format: attestationDésignation.format,
          documentKey: attestationDésignation.formatter(),
          peutÊtreTéléchargé: true,
        });
      }

      // EXPORT
      documents.push({
        type: 'Export des données du projet',
        date: DateTime.now().formatter(),
        format: 'csv',
        url: Routes.Lauréat.exporter({ nomProjet }),
        peutÊtreTéléchargé: rôle.aLaPermission('lauréat.listerLauréatEnrichi'),
      });

      // ABANDON
      if (abandon) {
        const demandeAbandon = await mediator.send<Lauréat.Abandon.ConsulterDemandeAbandonQuery>({
          type: 'Lauréat.Abandon.Query.ConsulterDemandeAbandon',
          data: {
            identifiantProjetValue: identifiantProjet,
            demandéLeValue: abandon.demandéLe.formatter(),
          },
        });

        if (Option.isNone(demandeAbandon)) {
          return notFound();
        }

        if (demandeAbandon.demande.pièceJustificative) {
          documents.push({
            type: "Pièce(s) justificative(s) de la demande d'abandon",
            date: demandeAbandon.demande.pièceJustificative.dateCréation,
            format: demandeAbandon.demande.pièceJustificative.format,
            documentKey: demandeAbandon.demande.pièceJustificative.formatter(),
            demande: {
              date: demandeAbandon.demande.demandéLe.formatter(),
            },
            peutÊtreTéléchargé: true,
          });
        }

        if (demandeAbandon.demande.accord) {
          documents.push({
            type: "Réponse signée de l'accord de la demande d'abandon",
            date: demandeAbandon.demande.accord.réponseSignée.dateCréation,
            format: demandeAbandon.demande.accord.réponseSignée.format,
            documentKey: demandeAbandon.demande.accord.réponseSignée.formatter(),
            peutÊtreTéléchargé: true,
          });
        }

        if (demandeAbandon.demande.rejet) {
          documents.push({
            type: "Réponse signée du rejet de la demande d'abandon",
            date: demandeAbandon.demande.rejet.réponseSignée.dateCréation,
            format: demandeAbandon.demande.rejet.réponseSignée.format,
            documentKey: demandeAbandon.demande.rejet.réponseSignée.formatter(),
            peutÊtreTéléchargé: true,
          });
        }
      }

      // ACHEVEMENT
      const achèvement = await getAchèvement(identifiantProjet);

      if (achèvement.estAchevé) {
        documents.push({
          type: 'Attestation de conformité',
          date: achèvement.attestation.dateCréation,
          format: achèvement.attestation.format,
          documentKey: achèvement.attestation.formatter(),
          peutÊtreTéléchargé: true,
        });

        if (Option.isSome(achèvement.preuveTransmissionAuCocontractant)) {
          documents.push({
            type: 'Preuve de transmission au co-contractant',
            date: achèvement.preuveTransmissionAuCocontractant.dateCréation,
            format: achèvement.preuveTransmissionAuCocontractant.format,
            documentKey: achèvement.preuveTransmissionAuCocontractant.formatter(),
            peutÊtreTéléchargé: true,
          });
        }
      }

      return (
        <>
          <Notice
            title="À propos"
            description={
              <span>
                Retrouvez dans cette section les documents essentiels de la vie de votre projet
              </span>
            }
            severity="info"
          />
          <DocumentsList documents={documents.toSorted((a, b) => b.date.localeCompare(a.date))} />
        </>
      );
    }),
    sectionTitle,
  );
