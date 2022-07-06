import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import { Input, Astérisque } from '@components'
import { format } from 'date-fns'
interface AdminReponseModificationDelaiFormProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'delai' }
}
export const AdminReponseModificationDelaiForm = ({
  modificationRequest,
}: AdminReponseModificationDelaiFormProps) => {
  const { project, delayInMonths, dateAchèvementDemandée } = modificationRequest
  const dateDemandée = dateAchèvementDemandée
    ? new Date(dateAchèvementDemandée)
    : delayInMonths
    ? new Date(
        new Date(project.completionDueOn).setMonth(
          new Date(project.completionDueOn).getMonth() + delayInMonths
        )
      )
    : null

  return (
    <div className="mt-4 mb-4">
      <label htmlFor="dateAchèvementAccordée">
        Date limite d'achèvement accordée <Astérisque />
      </label>
      <Input
        type="date"
        name="dateAchèvementAccordée"
        id="dateAchèvementAccordée"
        {...(dateAchèvementDemandée && {
          defaultValue: format(dateDemandée, 'yyyy-MM-dd'),
        })}
        min={formatDate(project.completionDueOn, 'YYYY-MM-DD')}
        required
        aria-required="true"
      />
    </div>
  )
}
