// Error envelope shared by every non-2xx response of the API contract.
// The codes and the envelope shape come from docs/api-contract.md.
export type ApiErrorCode =
  | "invalid_request"
  | "configuration_error"
  | "quota_exceeded"
  | "provider_error"
  | "internal_error";

export type ApiErrorDto = { error: { code: ApiErrorCode; message: string; retryable: boolean } };

// TODO(D1·B2.2): Export `respondWithApiError(context, code, message)`, which builds this
// envelope with the HTTP status and `retryable` value the contract assigns to each code,
// and `handleUnexpectedError(error, context)` for the app-level error handler.
// Read the error table in docs/api-contract.md before this increment and use the
// `message` it fixes for each code. Messages are technical and must never contain secrets, stack traces or raw provider bodies.
