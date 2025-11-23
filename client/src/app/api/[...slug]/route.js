const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  `http://${process.env.HOST}:${process.env.NEXT_PUBLIC_PORT_API}`;

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const { search } = new URL(request.url);
  const url = `${apiUrl}/${resolvedParams.slug.join("/")}${search}`;

  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const cookies = request.headers.get("cookie");
  if (cookies) {
    headers["cookie"] = cookies;
    console.log("GET - Sending cookies to backend");
  }

  try {
    console.log("GET request to:", url);
    const response = await fetch(url, {
      headers,
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    let data;
    if (response.status === 204) {
      data = null;
    } else {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    }

    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    if (setCookieHeaders.length > 0) {
      responseHeaders["Set-Cookie"] = setCookieHeaders;
    } else {
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        responseHeaders["Set-Cookie"] = setCookieHeader;
      }
    }

    if (response.status === 204) {
      return new Response(null, {
        status: 204,
        headers: responseHeaders,
      });
    }

    return Response.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to fetch", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  const resolvedParams = await params;
  const { search } = new URL(request.url);
  const url = `${apiUrl}/${resolvedParams.slug.join("/")}${search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() === "content-length") return;
    headers.set(key, value);
  });

  const cookies = request.headers.get("cookie");
  if (cookies) {
    headers.set("cookie", cookies);
    console.log("Sending cookies to backend");
  } else {
    console.log("No cookies found in request");
  }

  try {
    console.log("POST request to:", url);
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: request.body,
      duplex: "half",
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    let data;
    if (response.status === 204) {
      data = null;
    } else {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    }

    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    if (setCookieHeaders.length > 0) {
      responseHeaders["Set-Cookie"] = setCookieHeaders;
    } else {
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        responseHeaders["Set-Cookie"] = setCookieHeader;
      }
    }

    if (response.status === 204) {
      return new Response(null, {
        status: 204,
        headers: responseHeaders,
      });
    }

    return Response.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to fetch", details: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  const resolvedParams = await params;
  const { search } = new URL(request.url);
  const url = `${apiUrl}/${resolvedParams.slug.join("/")}${search}`;
  const body = await request.text();

  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const cookies = request.headers.get("cookie");
  if (cookies) {
    headers["cookie"] = cookies;
    console.log("PUT - Sending cookies to backend");
  }

  try {
    console.log("PUT request to:", url);
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body,
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    let data;
    if (response.status === 204) {
      data = null;
    } else {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    }

    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    if (setCookieHeaders.length > 0) {
      responseHeaders["Set-Cookie"] = setCookieHeaders;
    } else {
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        responseHeaders["Set-Cookie"] = setCookieHeader;
      }
    }

    if (response.status === 204) {
      return new Response(null, {
        status: 204,
        headers: responseHeaders,
      });
    }

    return Response.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to fetch", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  const { search } = new URL(request.url);
  const url = `${apiUrl}/${resolvedParams.slug.join("/")}${search}`;

  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const cookies = request.headers.get("cookie");
  if (cookies) {
    headers["cookie"] = cookies;
    console.log("DELETE - Sending cookies to backend");
  }

  try {
    console.log("DELETE request to:", url);
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    let data;
    if (response.status === 204) {
      data = null;
    } else {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    }

    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    if (setCookieHeaders.length > 0) {
      responseHeaders["Set-Cookie"] = setCookieHeaders;
    } else {
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        responseHeaders["Set-Cookie"] = setCookieHeader;
      }
    }

    if (response.status === 204) {
      return new Response(null, {
        status: 204,
        headers: responseHeaders,
      });
    }

    return Response.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to fetch", details: error.message },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
