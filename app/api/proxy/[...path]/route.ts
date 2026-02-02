import { NextRequest, NextResponse } from "next/server";
import { apiServer } from "@/lib/api/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const MAX_RETRIES = 3;

async function requestWithRetry(config: any) {
  let attempt = 0;
  while (true) {
    try {
      return await apiServer.request(config);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 429 && attempt < MAX_RETRIES) {
        const retryAfterHeader = error.response?.headers?.["retry-after"];
        const retryAfterSeconds = parseInt(retryAfterHeader || "1", 10);
        const retryAfterMs = Number.isNaN(retryAfterSeconds)
          ? 1000
          : Math.max(1, retryAfterSeconds) * 1000;

        attempt += 1;
        console.warn(
          `429 Too Many Requests. Retry #${attempt} after ${retryAfterMs}ms`
        );
        await delay(retryAfterMs);
        continue;
      }

      throw error;
    }
  }
}

// Универсальный прокси для всех запросов
export async function GET(request: NextRequest) {
  return proxyRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, "POST");
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, "PUT");
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, "DELETE");
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request, "PATCH");
}

async function proxyRequest(request: NextRequest, method: string) {
  try {
    // Отримуємо шлях після /api/proxy/ і додаємо префікс /api/ для бекенду
    const pathname = request.nextUrl.pathname.replace("/api/proxy", "");
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `/api${pathname}${searchParams ? `?${searchParams}` : ""}`;

    // Підготовка заголовків
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Передаємо Authorization header якщо є
    const authHeader = request.headers.get("Authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    } else {
      const tokenCookie =
        request.cookies.get("accessToken")?.value ||
        request.cookies.get("access_token")?.value ||
        request.cookies.get("auth-token")?.value;
      if (tokenCookie) {
        headers["Authorization"] = `Bearer ${tokenCookie}`;
      }
    }

    // Передаємо cookies від клієнта до бекенду
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    // Підготовка body для POST, PUT, PATCH
    let body: string | undefined;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const contentType = request.headers.get("content-type");

      if (contentType?.includes("multipart/form-data")) {
        const formData = await request.formData();

        const response = await requestWithRetry({
          url,
          method: method as any,
          headers: {
            ...(authHeader && { Authorization: authHeader }),
            ...(cookieHeader && { Cookie: cookieHeader }),
          },
          data: formData as any,
        });

        const nextResponse = NextResponse.json(response.data, {
          status: response.status,
        });

        const setCookieHeaders = response.headers["set-cookie"];
        if (setCookieHeaders) {
          if (Array.isArray(setCookieHeaders)) {
            setCookieHeaders.forEach((cookie) => {
              nextResponse.headers.append("Set-Cookie", cookie);
            });
          } else {
            nextResponse.headers.set("Set-Cookie", setCookieHeaders);
          }
        }

        return nextResponse;
      } else {
        // Для JSON - перевіряємо чи є body
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 0) {
          try {
            const jsonBody = await request.json();
            body = JSON.stringify(jsonBody);
          } catch (error) {
            // Якщо немає body, не проблема - деякі POST запити не потребують body
          }
        }
      }
    }

    // Виконання запиту
    const response = await requestWithRetry({
      url,
      method: method as any,
      headers,
      ...(body && { data: body }),
    });

    // Створюємо відповідь
    const nextResponse = NextResponse.json(response.data, {
      status: response.status,
    });

    // Передаємо Set-Cookie headers від бекенду до клієнта
    const setCookieHeaders = response.headers["set-cookie"];
    if (setCookieHeaders) {
      if (Array.isArray(setCookieHeaders)) {
        setCookieHeaders.forEach((cookie) => {
          nextResponse.headers.append("Set-Cookie", cookie);
        });
      } else {
        nextResponse.headers.set("Set-Cookie", setCookieHeaders);
      }
    }

    return nextResponse;
  } catch (error: any) {
    console.error("Proxy error:", error);
    console.error("Error message:", error.message);
    console.error("Error response status:", error.response?.status);
    console.error("Error response data:", error.response?.data);
    console.error("Error response headers:", error.response?.headers);

    if (error.response?.status === 429) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Занадто багато запитів. Спробуйте пізніше.",
            statusCode: 429,
          },
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Proxy request failed",
        message: error.message,
        details: error.response?.data,
        status: error.response?.status,
      },
      { status: error.response?.status || 500 }
    );
  }
}
