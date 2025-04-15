import Alert from '@codegouvfr/react-dsfr/Alert';

type Props = {
  dépasseLesRatioDeAppelOffres: boolean;
  dépassePuissanceMaxDuVolumeRéservé: boolean;
  dépassePuissanceMaxFamille: boolean;
  dépasseRatiosChangementPuissanceDuCahierDesChargesInitial: boolean;
  aChoisiCDC2022: boolean;
  fourchetteRatioInitialEtCDC2022AlertMessage?: string;
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
  aChoisiCDC2022,
  dépasseRatiosChangementPuissanceDuCahierDesChargesInitial,
  fourchetteRatioInitialEtCDC2022AlertMessage,
  unitéPuissance,
  puissanceMaxVoluméRéservé,
  puissanceMaxFamille,
  ratioAppelOffre: { min, max },
}: Props) => {
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

      {!dépassePuissanceMaxDuVolumeRéservé &&
        aChoisiCDC2022 &&
        !dépasseLesRatioDeAppelOffres &&
        dépasseRatiosChangementPuissanceDuCahierDesChargesInitial &&
        fourchetteRatioInitialEtCDC2022AlertMessage && (
          <Alert
            severity="error"
            small
            description={
              <div>
                <span className="font-bold">
                  Si vous ne respectez pas les conditions suivantes, cela pourrait impacter la
                  remise de votre attestation de conformité.
                </span>
                <br />
                <span className="whitespace-pre-line">
                  {fourchetteRatioInitialEtCDC2022AlertMessage}
                </span>
              </div>
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
