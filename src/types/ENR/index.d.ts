declare namespace ENR {
  export type HttpRequest = {
    body: string
    query: any
    params: any
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
}
