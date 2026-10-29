export class RequestError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function api<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch("/api/wallet/" + path, {
      method,
      headers:
        body instanceof FormData
          ? undefined
          : { "Content-Type": "application/json" },
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new RequestError(
      method === "GET"
        ? "Koneksi terputus. Coba muat ulang."
        : "Respons belum diterima. Periksa Aktivitas sebelum mencoba kembali.",
      method === "GET" ? "NETWORK" : "UNCERTAIN",
      0,
    );
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new RequestError(
      "Respons layanan belum dapat dipastikan. Periksa aktivitas sebelum mencoba kembali.",
      method === "GET" ? "REQUEST_FAILED" : "UNCERTAIN",
      response.status,
    );
  }
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith("auth/")) {
      sessionStorage.removeItem("rewallet-draft");
      window.dispatchEvent(
        new CustomEvent("rewallet-navigate", {
          detail: "/login?returnTo=" + encodeURIComponent(location.pathname),
        }),
      );
    }
    if (data.code === "ONBOARDING")
      window.dispatchEvent(
        new CustomEvent("rewallet-navigate", { detail: "/onboarding/pin" }),
      );
    throw new RequestError(
      data.message ?? "Permintaan gagal.",
      data.code ?? "REQUEST_FAILED",
      response.status,
    );
  }
  return data as T;
}
