import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { getAchèvement, getLauréat } from '@/app/laureats/[identifiant]/_helpers';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { DocumentsList } from './DocumentsDétails';
import { DocumentItem } from './DocumentListItem';

type DocumentsSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Documents';
export const DocumentsSection = ({ identifiantProjet }: DocumentsSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const documents: Array<DocumentItem> = [];

      const {
        lauréat: { nomProjet, attestationDésignation },
        actionnaire,
        représentantLégal,
        abandon,
        puissance,
      } = await getLauréat(identifiantProjet);

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

      // DEMANDES EN COURS
      if (actionnaire.dateDemandeEnCours) {
        const changement =
          await mediator.send<Lauréat.Actionnaire.ConsulterChangementActionnaireQuery>({
            type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
            data: {
              identifiantProjet: identifiantProjet,
              demandéLe: actionnaire.dateDemandeEnCours.formatter(),
            },
          });

        if (Option.isNone(changement)) {
          return notFound();
        }

        if (changement.demande.pièceJustificative) {
          documents.push({
            type: "Pièce(s) justificative(s) de la demande de changement d'actionnaire",
            date: changement.demande.pièceJustificative.dateCréation,
            format: changement.demande.pièceJustificative.format,
            documentKey: changement.demande.pièceJustificative.formatter(),
            demande: {
              date: changement.demande.demandéeLe.formatter(),
            },
            peutÊtreTéléchargé: true,
          });
        }
      }

      if (puissance.dateDemandeEnCours) {
        const changement = await mediator.send<Lauréat.Puissance.ConsulterChangementPuissanceQuery>(
          {
            type: 'Lauréat.Puissance.Query.ConsulterChangementPuissance',
            data: {
              identifiantProjet: identifiantProjet,
              demandéLe: puissance.dateDemandeEnCours.formatter(),
            },
          },
        );

        if (Option.isNone(changement)) {
          return notFound();
        }

        if (changement.demande.pièceJustificative) {
          documents.push({
            type: 'Pièce(s) justificative(s) de la demande de changement de puissance',
            date: changement.demande.pièceJustificative.dateCréation,
            format: changement.demande.pièceJustificative.format,
            documentKey: changement.demande.pièceJustificative.formatter(),
            peutÊtreTéléchargé: true,
          });
        }
      }

      if (représentantLégal.demandeEnCours?.demandéLe) {
        const changement =
          await mediator.send<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
            type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
            data: {
              identifiantProjet: identifiantProjet,
              demandéLe: représentantLégal.demandeEnCours?.demandéLe,
            },
          });

        if (Option.isNone(changement)) {
          return notFound();
        }

        if (changement.demande.pièceJustificative) {
          documents.push({
            type: 'Pièce(s) justificative(s) de la demande de changement de représentant légal',
            date: changement.demande.pièceJustificative.dateCréation,
            format: changement.demande.pièceJustificative.format,
            documentKey: changement.demande.pièceJustificative.formatter(),
            peutÊtreTéléchargé: true,
          });
        }
      }

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
          type: achèvement.attestation.typeDocument,
          date: achèvement.attestation.dateCréation,
          format: achèvement.attestation.format,
          documentKey: achèvement.attestation.formatter(),
          peutÊtreTéléchargé: true,
        });

        if (Option.isSome(achèvement.preuveTransmissionAuCocontractant)) {
          documents.push({
            type: achèvement.preuveTransmissionAuCocontractant.typeDocument,
            date: achèvement.preuveTransmissionAuCocontractant.dateCréation,
            format: achèvement.preuveTransmissionAuCocontractant.format,
            documentKey: achèvement.preuveTransmissionAuCocontractant.formatter(),
            peutÊtreTéléchargé: true,
          });
        }
      }

      // TODO V2 - à discuter : récupérer toutes les demandes (mêmes "anciennes") et les informations enregistrées ?

      // trier les documents par date

      return (
        <DocumentsList documents={documents.toSorted((a, b) => b.date.localeCompare(a.date))} />
      );
    }),
    sectionTitle,
  );
