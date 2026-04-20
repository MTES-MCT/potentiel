import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import Notice from '@codegouvfr/react-dsfr/Notice';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';

import {
  getAbandonInfos,
  getAchèvement,
  getGarantiesFinancières,
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

      // ATTESTATION LAURÉAT
      const { attestationDésignation, nomProjet } = await getLauréatInfos(identifiantProjet);

      if (attestationDésignation) {
        documents.push({
          type: 'Attestation de désignation',
          date: attestationDésignation.dateCréation,
          format: attestationDésignation.format,
          url: Routes.Document.télécharger(attestationDésignation.formatter()),
          ariaLabel: `Télécharger l'attestation de désignation du projet ${nomProjet}`,
        });
      }

      // EXPORT LAURÉAT
      if (rôle.aLaPermission('lauréat.listerLauréatEnrichi')) {
        documents.push({
          type: 'Export des données du projet',
          format: 'csv',
          url: Routes.Lauréat.exporter({ identifiantProjet }),
          ariaLabel: `Télécharger l'export des données du projet ${nomProjet}`,
        });
      }

      // ABANDON
      const abandon = await getAbandonInfos(identifiantProjet);

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

        if (demandeAbandon.demande.accord) {
          documents.push({
            type: "Réponse signée de l'accord de la demande d'abandon",
            date: demandeAbandon.demande.accord.réponseSignée.dateCréation,
            format: demandeAbandon.demande.accord.réponseSignée.format,
            url: Routes.Document.télécharger(
              demandeAbandon.demande.accord.réponseSignée.formatter(),
            ),
            demande: {
              url: Routes.Abandon.détail(
                identifiantProjet,
                demandeAbandon.demande.demandéLe.formatter(),
              ),
            },
            ariaLabel: `Télécharger la réponse de l'accord de la demande d'abandon du projet ${nomProjet}`,
          });
        }

        if (demandeAbandon.demande.rejet) {
          documents.push({
            type: "Réponse signée du rejet de la demande d'abandon",
            date: demandeAbandon.demande.rejet.réponseSignée.dateCréation,
            format: demandeAbandon.demande.rejet.réponseSignée.format,
            url: Routes.Document.télécharger(
              demandeAbandon.demande.rejet.réponseSignée.formatter(),
            ),
            demande: {
              url: Routes.Abandon.détail(
                identifiantProjet,
                demandeAbandon.demande.demandéLe.formatter(),
              ),
            },
            ariaLabel: `Télécharger la réponse du rejet de la demande d'abandon du projet ${nomProjet}`,
          });
        }
      }

      // GARANTIES FINANCIERES
      if (
        rôle.aLaPermission('garantiesFinancières.actuelles.consulter') &&
        rôle.aLaPermission('garantiesFinancières.dépôt.consulter')
      ) {
        const garantiesFinancièresActuelles = await getGarantiesFinancières(identifiantProjet);

        if (garantiesFinancièresActuelles.actuelles?.document) {
          documents.push({
            type: 'Attestation de constitution des garanties financières',
            date: garantiesFinancièresActuelles.actuelles?.document.dateCréation,
            format: garantiesFinancièresActuelles.actuelles?.document.format,
            url: Routes.Document.télécharger(
              garantiesFinancièresActuelles.actuelles?.document.formatter(),
            ),
            ariaLabel: `Télécharger l'attestation de constitution des garanties financières du projet ${nomProjet}`,
          });
        }
      }

      // ACHEVEMENT
      const achèvement = await getAchèvement(identifiantProjet);

      if (achèvement.estAchevé && Option.isSome(achèvement.attestation)) {
        documents.push({
          type: 'Attestation de conformité',
          date: achèvement.attestation.dateCréation,
          format: achèvement.attestation.format,
          url: Routes.Document.télécharger(achèvement.attestation.formatter()),
          ariaLabel: `Télécharger l'attestation de conformité du projet ${nomProjet}`,
        });

        if (Option.isSome(achèvement.preuveTransmissionAuCocontractant)) {
          documents.push({
            type: 'Preuve de transmission au Cocontractant',
            date: achèvement.preuveTransmissionAuCocontractant.dateCréation,
            format: achèvement.preuveTransmissionAuCocontractant.format,
            url: Routes.Document.télécharger(
              achèvement.preuveTransmissionAuCocontractant.formatter(),
            ),
            ariaLabel: `Télécharger la preuve de transmission au Cocontractant du projet ${nomProjet}`,
          });
        }
      }

      return (
        <>
          <Notice
            title="À propos"
            description={
              <span>Retrouvez dans cette section les documents essentiels de la vie du projet</span>
            }
            severity="info"
          />
          <DocumentsList
            documents={documents.toSorted((a, b) => (b.date || '').localeCompare(a.date || ''))}
          />
        </>
      );
    }),
    sectionTitle,
  );
