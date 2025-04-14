type Props = {
  dépasseLesRatioDeAppelOffres: boolean;
  dépassePuissanceMaxDuVolumeRéservé: boolean;
  dépassePuissanceMaxFamille: boolean;
};

export const DemanderChangementPuissanceFormErrors = ({
  dépasseLesRatioDeAppelOffres,
  dépassePuissanceMaxDuVolumeRéservé,
  dépassePuissanceMaxFamille,
}: Props) => {
  console.log(dépasseLesRatioDeAppelOffres);
  console.log(dépassePuissanceMaxDuVolumeRéservé);
  console.log(dépassePuissanceMaxFamille);
  return <div></div>;
};
