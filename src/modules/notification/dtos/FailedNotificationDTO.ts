export interface FailedNotificationDTO {
  id: string
  recipient: {
    email: string
    name: string
  }
  type: string
  createdAt: Date
  error: string
}
