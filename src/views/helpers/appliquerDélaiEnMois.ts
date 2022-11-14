type AppliquerDélaiEnMoisProps = (args: { dateActuelle: Date; délaiEnMois: number }) => Date

export const appliquerDélaiEnMois: AppliquerDélaiEnMoisProps = ({ dateActuelle, délaiEnMois }) =>
  new Date(
    new Date(
      new Date(dateActuelle).setMonth(new Date(dateActuelle).getMonth() + délaiEnMois)
    ).setDate(
      new Date(
        new Date(dateActuelle).setMonth(new Date(dateActuelle).getMonth() + délaiEnMois)
      ).getDate() + 1
    )
  )
