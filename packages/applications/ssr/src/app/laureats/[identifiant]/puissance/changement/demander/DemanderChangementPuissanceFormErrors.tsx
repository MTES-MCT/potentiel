import Alert from '@codegouvfr/react-dsfr/Alert';

import { Lauréat } from '@potentiel-domain/projet';

type Props = {
  aChoisiCDC2022: boolean;
  fourchetteRatioInitialEtCDC2022AlertMessage?: string;
  unitéPuissance: string;
  ratioCdcActuel: Lauréat.Puissance.RatioChangementPuissance.ValueType;
};

export const DemanderChangementPuissanceFormErrors = ({
  aChoisiCDC2022,
  fourchetteRatioInitialEtCDC2022AlertMessage,
  unitéPuissance,
  ratioCdcActuel,
}: Props) => {
  return (
    <div>
      {ratioCdcActuel.dépassePuissanceMaxFamille() && (
        <Alert
          severity="error"
          small
          description={
            <span>
              Les modifications de la puissance installée doivent être strictement inférieures au
              plafond de puissance de la famille du projet, soit{' '}
              <strong>
                {ratioCdcActuel.puissanceMaxFamille} {unitéPuissance}
              </strong>
            </span>
          }
        />
      )}
      {!ratioCdcActuel.dépassePuissanceMaxDuVolumeRéservé() &&
        !ratioCdcActuel.dépassePuissanceMaxFamille() &&
        ratioCdcActuel.dépasseRatiosChangementPuissance() && (
          <Alert
            severity="warning"
            small
            description={
              <span>
                Une autorisation est nécessaire si la modification de puissance est inférieure à{' '}
                <strong>{Math.round(ratioCdcActuel.ratios.min * 100)}%</strong> de la puissance
                initiale ou supérieure à{' '}
                <strong>{Math.round(ratioCdcActuel.ratios.max * 100)}%</strong>. Dans ces cas, il
                est nécessaire de{' '}
                <strong>joindre une justification, assortie d'un justificatif</strong> à votre
                demande .
              </span>
            }
          />
        )}

      {!ratioCdcActuel.dépassePuissanceMaxDuVolumeRéservé() &&
        aChoisiCDC2022 &&
        !ratioCdcActuel.dépasseRatiosChangementPuissance() &&
        fourchetteRatioInitialEtCDC2022AlertMessage && (
          <Alert
            severity="warning"
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
      {ratioCdcActuel.dépassePuissanceMaxDuVolumeRéservé() && (
        <Alert
          severity="error"
          small
          description={
            <span>
              Votre projet étant dans le volume réservé, les modifications de la puissance installée
              ne peuvent pas dépasser le plafond de puissance de{' '}
              <strong>
                {ratioCdcActuel.volumeRéservé?.puissanceMax} {unitéPuissance}
              </strong>{' '}
              spécifié au paragraphe 1.2.2 du cahier des charges.
            </span>
          }
        />
      )}
    </div>
  );
};
