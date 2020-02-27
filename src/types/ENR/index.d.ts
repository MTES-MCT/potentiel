declare namespace ENR {
  export type HttpRequest = {
    body: string
    query: any
    params: any
    user: User
  }

  export type HttpResponse = {
    statusCode: number
    body: string
  }

  export type Controller = (req: HttpRequest) => Promise<HttpResponse>

  type Credentials = {
    readonly email: string
    readonly hash: string
    readonly userId: string
  }

  export const enum UserRole {
    Admin,
    DGEC,
    PorteurProjet
  }

  export type User = {
    readonly firstName: string
    readonly lastName: string
    readonly role: ENR.UserRole
    readonly id?: number
  }
}
