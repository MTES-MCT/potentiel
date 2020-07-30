import moment from 'moment-timezone'

function formatDate(timestamp: number, format?: string) {
  return moment(timestamp)
    .tz('Europe/Paris')
    .format(format || 'DD/MM/YYYY')
}

export { formatDate }
