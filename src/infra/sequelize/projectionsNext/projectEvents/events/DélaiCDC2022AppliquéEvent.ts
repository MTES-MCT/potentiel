import { ProjectEvent } from '..'

export type DélaiCDC2022AppliquéEvent = ProjectEvent & {
  type: 'DélaiCDC2022Appliqué'
  payload: { ancienneDateLimiteAchèvement: string; nouvelleDateLimiteAchèvement: string }
}
