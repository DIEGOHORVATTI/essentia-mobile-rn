export async function fhirFetch(
  input: Request | string | URL,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers)
  headers.set('Accept', 'application/fhir+json, application/json')

  const response = await fetch(input, { ...init, headers })

  const text = await response.text()

  const normalized = new Headers(response.headers)
  normalized.set('content-type', 'application/json')

  return new Response(text, {
    status: response.status,
    statusText: response.statusText,
    headers: normalized,
  })
}
