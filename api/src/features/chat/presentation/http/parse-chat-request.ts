// TODO(D1·B2.2): Export `parseChatRequest(rawBody)`, which validates the request body of
// POST /api/chat exactly as docs/api-contract.md defines it (JSON object, only the
// `message` property, trimmed text within the contract limit) and returns either the
// accepted message or an `invalid_request` reason. Invalid input is rejected here,
// before the gateway is called. Read the request and validation sections of
// docs/api-contract.md before this increment.
