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
};

export const DemanderChangementPuissanceFormErrors = ({
  dépasseLesRatioDeAppelOffres,
  dépassePuissanceMaxDuVolumeRéservé,
  dépassePuissanceMaxFamille,
  unitéPuissance,
  puissanceMaxVoluméRéservé,
  ratioAppelOffre: { min, max },
}: Props) => {
  console.log(dépassePuissanceMaxFamille);
  console.log(puissanceMaxVoluméRéservé);

  return (
    <div>
      {dépassePuissanceMaxDuVolumeRéservé && puissanceMaxVoluméRéservé !== undefined && (
        <Alert
          className="mt-4"
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
