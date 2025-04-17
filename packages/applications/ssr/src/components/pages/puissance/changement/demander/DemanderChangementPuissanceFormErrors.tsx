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
              Les modifications de la puissance installée ne peuvent pas dépasser le plafond de
              puissance de la famille du projet, soit{' '}
              <strong>
                {puissanceMaxFamille} {unitéPuissance}
              </strong>
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
                <strong>{Math.round(min * 100)}%</strong> de la puissance initiale ou supérieure à{' '}
                <strong>{Math.round(max * 100)}%</strong>. Dans ces cas, il est nécessaire de{' '}
                <strong>joindre un justificatif à votre demande</strong>.
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
                <strong>
                  Si vous ne respectez pas les conditions suivantes, cela pourrait impacter la
                  remise de votre attestation de conformité.
                </strong>
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
              Votre projet étant dans le volume réservé, les modifications de la puissance installée
              ne peuvent pas dépasser le plafond de puissance de{' '}
              <strong>
                {puissanceMaxVoluméRéservé} {unitéPuissance}
              </strong>{' '}
              spécifié au paragraphe 1.2.2 du cahier des charges.
            </span>
          }
        />
      )}
    </div>
  );
};
