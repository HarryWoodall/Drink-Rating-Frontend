export class HttpError<T = unknown> extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: T,
    public response: Response,
  ) {
    super((body as { message?: string })?.message ?? `${status} ${statusText}`);
    this.name = "HttpError";
  }
}
