import Alert from '@codegouvfr/react-dsfr/Alert';

type Props = {
  dépasseLesRatioDeAppelOffres: boolean;
  dépassePuissanceMaxDuVolumeRéservé: boolean;
  dépassePuissanceMaxFamille: boolean;
  ratioAppelOffre: {
    min: number;
    max: number;
  };
  unitéPuissance: string;
  puissanceMaxVoluméRéservé?: number;
  puissanceMaxFamille?: number;
};

export const DemanderChangementPuissanceFormErrors = ({
  dépasseLesRatioDeAppelOffres,
  dépassePuissanceMaxDuVolumeRéservé,
  dépassePuissanceMaxFamille,
  unitéPuissance,
  puissanceMaxVoluméRéservé,
  puissanceMaxFamille,
  ratioAppelOffre: { min, max },
}: Props) => {
  // {
  //   !puissanceMaxVolumeReservéDépassée &&
  //     CDC2022choisi &&
  //     displayAlertOnPuissancebetweenInitialAndCDC2022Ratios && (
  //       <AlertePuissanceFourchetteRatioInitialEtCDC2022
  //         {...{
  //           project: {
  //             appelOffre,
  //             cahierDesCharges: parseCahierDesChargesRéférence(cahierDesChargesActuel),
  //           },
  //         }}
  //       />
  //     );
  // }

  //     setDisplayAlertOnPuissancebetweenInitialAndCDC2022Ratios(
  //   exceedInitialCDCRatio && !exceedsActualCDCRatios,
  // );

  //   const CDC2022choisi = ['30/08/2022', '30/08/2022-alternatif'].includes(cahierDesChargesActuel);

  // export const AlertePuissanceFourchetteRatioInitialEtCDC2022 = ({
  //   project,
  // }: AlertePuissanceFourchetteRatioInitialEtCDC2022Props) => {
  //   const alerteMessage = project.appelOffre.periode.cahiersDesChargesModifiésDisponibles.find(
  //     (cdc) =>
  //       cdc.type === project.cahierDesCharges.type &&
  //       cdc.paruLe === project.cahierDesCharges.paruLe &&
  //       cdc.alternatif === project.cahierDesCharges.alternatif,
  //   )?.seuilSupplémentaireChangementPuissance?.paragrapheAlerte;

  //   return (
  //     <AlertBox className="mt-4">
  //       <span className="font-bold">
  //         Si vous ne respectez pas les conditions suivantes, cela pourrait impacter la remise de
  //         votre attestation de conformité.
  //       </span>
  //       <br />
  //       {alerteMessage ? <span className="whitespace-pre-line">{alerteMessage}</span> : ''}
  //     </AlertBox>
  //   );
  // };

  return (
    <div>
      {puissanceMaxFamille && dépassePuissanceMaxFamille && (
        <Alert
          severity="error"
          small
          description={
            <span>
              Les modifications de la Puissance installée ne peuvent pas dépasser le plafond de
              puissance de la famille du projet, soit {puissanceMaxFamille} {unitéPuissance}
            </span>
          }
        />
      )}
      {!dépassePuissanceMaxDuVolumeRéservé &&
        !dépassePuissanceMaxFamille &&
        dépasseLesRatioDeAppelOffres && (
          <Alert
            severity="error"
            small
            description={
              <span>
                Une autorisation est nécessaire si la modification de puissance est inférieure à{' '}
                {Math.round(min * 100)}% de la puissance initiale ou supérieure à{' '}
                {Math.round(max * 100)}
                %. Dans ces cas{' '}
                <strong>il est nécessaire de joindre un justificatif à votre demande</strong>.
              </span>
            }
          />
        )}
      {dépassePuissanceMaxDuVolumeRéservé && puissanceMaxVoluméRéservé !== undefined && (
        <Alert
          severity="error"
          small
          description={
            <span>
              Votre projet étant dans le volume réservé, les modifications de la Puissance installée
              ne peuvent pas dépasser le plafond de puissance de
              {puissanceMaxVoluméRéservé} {unitéPuissance} spécifié au paragraphe 1.2.2 du cahier
              des charges.
            </span>
          }
        />
      )}
    </div>
  );
};
