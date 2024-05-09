import React from 'react';
import { ContentArea, ItemTitle, NextUpIcon, PastIcon } from '.';
import { DownloadLink } from '../../UI';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { afficherDate } from '../../../helpers/afficherDate';
import { Routes } from '@potentiel-applications/routes';

export type AttestationConformiteItemProps = {
  attestationConformité?: {
    dateTransmissionAuCocontractant: Iso8601DateTime;
    attestation: string;
    preuveTransmissionAuCocontractant: string;
  };
};

export const AttestationConformiteItem = ({
  attestationConformité,
}: AttestationConformiteItemProps) => {
  if (attestationConformité) {
    const { attestation, preuveTransmissionAuCocontractant, dateTransmissionAuCocontractant } =
      attestationConformité;

    return (
      <>
        <PastIcon />
        <ContentArea>
          <ItemTitle title="Date d'achèvement réelle" />
          <p>Date de transmission : {afficherDate(new Date(dateTransmissionAuCocontractant))}</p>
          <DownloadLink
            fileUrl={Routes.Document.télécharger(attestation)}
            aria-label={`Télécharger l'attestation de conformité`}
          >
            Télécharger l'attestation de conformité
          </DownloadLink>
          <DownloadLink
            fileUrl={preuveTransmissionAuCocontractant}
            aria-label={`Télécharger la preuve de transmission au cocontractant`}
          >
            Télécharger la preuve de transmission au cocontractant
          </DownloadLink>
        </ContentArea>
      </>
    );
  }

  return (
    <>
      <NextUpIcon />
      <ContentArea>
        <ItemTitle title="Date d'achèvement prévisionnelle" />
        <p>En attente de la transmission de l'attestation de conformité</p>
        {/**
         * @todo doit-on afficher les messages suivants ?
         * 
         * {covidDelay && (
          <p className="p-0 mb-0 mt-3">
            Ce projet bénéficie d'une prolongation de délai d'achèvement ou de mise en service
            compte tenu de la crise liée au coronavirus (covid-19){' '}
            <Link
              aria-label={`Voir les critères d'attribution de la prolongation de délai d'achèvement ou de mise en service
            compte tenu de la crise liée au coronavirus (covid-19)`}
              href="https://www.ecologie.gouv.fr/sites/default/files/2004%20-%20SR%20-%20Note%20EDF%20OA%20D%C3%A9finition%20des%20d%C3%A9lais%20COVID%202019_v5.pdf"
              download
            >
              (critères d'attribution)
            </Link>
            .
          </p>
        )} 
        {délaiCDC2022Appliqué && (
          <p className="p-0 mb-0 mt-3">
            Ce projet bénéficie d'une prolongation de délai d'achèvement de 18 mois conformément au
            cahier des charges modifié rétroactivement et publié le 30/08/2022.
          </p>
        )} 
         * 
         * 
         */}
      </ContentArea>
    </>
  );
};
