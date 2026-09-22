/**
 * API service layer for the SecureVault Java Spring Boot backend.
 *
 * All cryptography (AES-256-CBC, PBKDF2-HMAC-SHA256, HMAC-SHA256, salt/IV
 * generation) is performed by the backend. This module only transports the
 * selected file and the password over a single multipart request and returns
 * the resulting binary.
 *
 * The password is passed as a function argument, sent once, and never stored
 * in localStorage/sessionStorage/cookies, never cached in a module variable,
 * and never logged.
 */

/** Backend base URL, e.g. http://localhost:8080 — never hardcoded in components. */
const API_BASE_URL = (
  (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ?? ""
).replace(/\/+$/, "");

/** 25 MB client-side upload ceiling. */
export const MAX_FILE_SIZE = 25 * 1024 * 1024;

export const ENCRYPTED_EXTENSION = ".enc";

export type ApiErrorKind = "network" | "validation" | "auth" | "server";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly kind: ApiErrorKind = "server",
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Result of a crypto operation: a File, which is a Blob that also carries the
 * filename resolved from the backend's Content-Disposition header.
 */
export type NamedBlob = File;

/** Extracts the backend-provided filename, falling back to a sensible default. */
function filenameFromDisposition(header: string | null, fallback: string): string {
  if (!header) return fallback;
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1]);
    } catch {
      return utf8[1];
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(header);
  return plain?.[1]?.trim() || fallback;
}

/** Reads a text/JSON error body from the backend without leaking binary noise. */
async function readErrorMessage(response: Response): Promise<string | null> {
  try {
    const text = await response.text();
    if (!text) return null;
    try {
      const parsed = JSON.parse(text) as { message?: string; error?: string };
      const message = parsed.message ?? parsed.error;
      return message && message.length <= 300 ? message : null;
    } catch {
      return text.length <= 300 ? text.trim() : null;
    }
  } catch {
    return null;
  }
}

async function postMultipart(
  path: string,
  file: File,
  password: string,
  fallbackFilename: string,
  authFailureMessage: string,
): Promise<NamedBlob> {
  const body = new FormData();
  // FormData keeps the file as binary — never JSON.stringify a File.
  body.append("file", file, file.name);
  body.append("password", password);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      body, // the browser sets multipart/form-data + boundary automatically
    });
  } catch {
    throw new ApiError(
      "Unable to reach the SecureVault server. Check that the backend is running and try again.",
      "network",
    );
  }

  if (!response.ok) {
    const serverMessage = await readErrorMessage(response);
    const status = response.status;

    if (status === 400 || status === 415 || status === 422) {
      throw new ApiError(
        serverMessage ?? "The server rejected this request. The file may be invalid or unsupported.",
        status === 422 ? "auth" : "validation",
        status,
      );
    }
    if (status === 401 || status === 403) {
      throw new ApiError(authFailureMessage, "auth", status);
    }
    if (status === 413) {
      throw new ApiError("This file is larger than the server allows.", "validation", status);
    }
    if (status === 404) {
      throw new ApiError(
        "The SecureVault API endpoint was not found. Check the configured backend URL.",
        "network",
        status,
      );
    }
    if (status >= 500) {
      throw new ApiError(
        serverMessage ?? "The server could not complete the operation. Please try again later.",
        "server",
        status,
      );
    }
    throw new ApiError(serverMessage ?? `Request failed with status ${status}.`, "server", status);
  }

  const blob = await response.blob();
  if (blob.size === 0) {
    throw new ApiError("The server returned an empty response.", "server", response.status);
  }

  const filename = filenameFromDisposition(response.headers.get("content-disposition"), fallbackFilename);
  return new File([blob], filename, { type: blob.type || "application/octet-stream" });
}

/**
 * POST {VITE_API_BASE_URL}/api/encrypt
 * multipart/form-data: file, password -> encrypted binary (.enc)
 */
export function encryptFile(file: File, password: string): Promise<NamedBlob> {
  return postMultipart(
    "/api/encrypt",
    file,
    password,
    `${file.name}${ENCRYPTED_EXTENSION}`,
    "Encryption could not be completed with the provided input.",
  );
}

/**
 * POST {VITE_API_BASE_URL}/api/decrypt
 * multipart/form-data: file, password -> original binary
 */
export function decryptFile(file: File, password: string): Promise<NamedBlob> {
  return postMultipart(
    "/api/decrypt",
    file,
    password,
    file.name.replace(/\.enc$/i, "") || "decrypted-file",
    // Deliberately ambiguous: never disclose whether the password or the
    // HMAC integrity check was responsible.
    "The password is incorrect or the encrypted file has been corrupted or modified.",
  );
}

/** Triggers a browser download for a returned binary payload. */
export function downloadResult(result: NamedBlob): void {
  const url = URL.createObjectURL(result);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = result.name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
