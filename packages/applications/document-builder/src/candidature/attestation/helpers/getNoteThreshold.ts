import { AppelOffre } from '@potentiel-domain/appel-offre';

type GetNoteThresholdProps = {
  puissance: number;
  territoireProjet?: string;
  famille?: AppelOffre.Famille;
  période: AppelOffre.Periode;
};

export const getNoteThreshold = ({
  puissance,
  territoireProjet,
  famille,
  période,
}: GetNoteThresholdProps) => {
  // TODO
  // if (!isNotifiedPeriode(période)) {
  //   logger.error(
  //     `candidateCertificate: looking for noteThreshold for a period that was not notified on Potentiel. Periode Id : ${période.id}`,
  //   );
  //   return 'N/A';
  // }

  if (période.noteThresholdBy === 'category') {
    const { volumeReserve, autres } = période.noteThreshold;
    if (puissance <= volumeReserve.puissanceMax) {
      return volumeReserve.noteThreshold;
    }

    return autres.noteThreshold;
  }

  if (période.noteThresholdBy === 'family') {
    if (territoireProjet && territoireProjet.length) {
      const note = période.noteThreshold.find(
        (item) => item.familleId === famille?.id && item.territoire === territoireProjet,
      )?.noteThreshold;

      if (!note) {
        // TODO
        // logger.error(
        //   `candidateCertificate: looking for noteThreshold for période: ${période.id}, famille: ${familleId} and territoire: ${territoireProjet} but could not find it`,
        // );
        return 'N/A';
      }

      return note;
    }

    const note = période.noteThreshold.find(
      (item) => item.familleId === famille?.id,
    )?.noteThreshold;

    if (!note) {
      // TODO
      // logger.error(
      //   `candidateCertificate: looking for noteThreshold for période: ${période.id} and famille: ${familleId} but could not find it`,
      // );
      return 'N/A';
    }

    return note;
  }

  return période.noteThreshold;
};
