import { useAuthStore, useModalStore } from "../store";
import { apiDomain } from "./constants";

export const request = async (
  uri: string,
  method: string,
  body?: string | FormData, // Stringified JSON
  headers?: Headers | {},
  external?: boolean
) => {
  try {

    method = method ?? 'GET'
    external = external ?? false
    // Request with GET/HEAD method cannot have body.
    body = method === 'GET' || method === 'HEAD' ? undefined : body

    headers = headers === undefined ?
      { "Content-Type": "application/json" }
      : { "Content-Type": "application/json", ...headers }

    const response = await fetch(
      external === false ?
        apiDomain + uri
        : uri,
      {
        mode: external === false ? 'cors' : 'no-cors',
        method: method,
        headers: headers,
        body
      }
    );

    if (response.status === 401) {
      const resp = await response.json()
      useAuthStore.getState().restoreDefault()
      useModalStore.getState().toast(resp?.message, 'danger')
    } else
      return response.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
}