export const EnregistrerDateMiseEnServiceAlert = () => (
  <div className="py-4 text-justify">
    <ul className="flex flex-col gap-3">
      {intervalleDatesMeSDélaiCDC2022 && (
        <li>
          Si le projet{' '}
          <span className="font-bold">
            a bénéficié du délai supplémentaire relatif du cahier des charges du 30/08/2022
          </span>
          , la saisie d'une date de mise en service non comprise entre le{' '}
          <FormattedDate className="font-bold" date={intervalleDatesMeSDélaiCDC2022.min} /> et le{' '}
          <FormattedDate className="font-bold" date={intervalleDatesMeSDélaiCDC2022.max} /> peut
          remettre en cause l'application de ce délai et entraîner une modification de la date
          d'achèvement du projet.
        </li>
      )}
      <li>
        Si le projet{' '}
        <span className="font-bold">
          n'a pas bénéficié du délai supplémentaire relatif du cahier des charges du 30/08/2022
        </span>
        , la saisie d'une date de mise en service doit être comprise entre la date de désignation du
        projet <FormattedDate className="font-bold" date={projet.dateDésignation} /> et{' '}
        <span className="font-bold">ce jour</span>.
      </li>
    </ul>
  </div>
);
