import Alert from '@codegouvfr/react-dsfr/Alert';

type Props = {
  dépasseLesRatioDeAppelOffres: boolean;
  dépassePuissanceMaxDuVolumeRéservé: boolean;
  dépassePuissanceMaxFamille: boolean;
};

// unitéPuissance
// volumeRéservé

export const DemanderChangementPuissanceFormErrors = ({
  dépasseLesRatioDeAppelOffres,
  dépassePuissanceMaxDuVolumeRéservé,
  dépassePuissanceMaxFamille,
}: Props) => {
  console.log(dépasseLesRatioDeAppelOffres);
  console.log(dépassePuissanceMaxDuVolumeRéservé);
  console.log(dépassePuissanceMaxFamille);
  return (
    <div>
      {dépassePuissanceMaxDuVolumeRéservé && (
        <Alert
          className="mt-4"
          severity="error"
          small
          description={
            <span>
              Votre projet étant dans le volume réservé, les modifications de la Puissance installée
              ne peuvent pas dépasser le plafond de puissance de
              {/* {reservedVolume.puissanceMax}{' '}
          {appelOffre.unitePuissance} spécifié au paragraphe 1.2.2 du cahier des charges. */}
            </span>
          }
        />
      )}
      {dépasseLesRatioDeAppelOffres && (
        <Alert
          className="mt-4"
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
    </div>
  );
};
