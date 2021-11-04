import moment from 'moment-timezone'

function formatDate(timestamp: number | Date, format?: string) {
  return moment(timestamp)
    .tz('Europe/Paris').locale('fr')
    .format(format || 'DD/MM/YYYY')
}

export { formatDate }
