import { NextResponse, NextRequest } from "next/server";
import { pathToRegexp } from "path-to-regexp";

type Middleware = {
  handler: MiddlewareHandler;
  pathRegex: RegExp;
};

type MiddlewareHandler = (
  request: NextRequest
) => NextResponse | Promise<NextResponse>;

async function manager(
  request: NextRequest,
  paths: string[],
  hasSrcFolder = false
) {
  const middlewares: Middleware[] = [];

  const basePath = hasSrcFolder ? "src/app" : "app";

  for (const p of paths) {
    const {
      default: handler,
      config: { matcher },
    } = await import(`../../${basePath}/middlewares/${p}`);

    middlewares.push({
      handler,
      pathRegex: pathToRegexp(matcher),
    });
  }

  const defaultResponse = NextResponse.next();

  for await (const middleware of middlewares) {
    if (middleware.pathRegex.test(request.nextUrl.pathname)) {
      const response: NextResponse = await middleware.handler(request);

      if (isRedirecting(response) || isRewriting(response)) {
        return response;
      }
    }
  }
  return defaultResponse;
}

function isRedirecting(response: NextResponse): boolean {
  return response.status === 307 || response.status === 308;
}
function isRewriting(response: NextResponse): boolean {
  return response.headers.has("x-middleware-rewrite");
}

export default manager;
