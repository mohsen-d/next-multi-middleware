# next-middleware-manager

Allows using of multiple `middlewares` in [NextJS](https://nextjs.org/) applications.

## USAGE

1- Create your middlewares in `middlewares/` folder inside `src/app/` or `app/` folder.

```TS
import { NextResponse, NextRequest } from "next/server";

export default function loggingMiddleware(request: NextRequest) {
  // Your logging logic
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path",
};

```

2- Add the `middleware.ts` file inside the `src/` folder or `root` of the project.

3- Import `next-multi-middleware` inside `middleware.ts`

4- Call `manager` function, passing `request` and list of middlewares' names into it.

```TS
import multiMiddlewareHandler from "next-multi-middleware";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return multiMiddlewareHandler(request, ["logging.ts", "auth.ts"]);
}
```

**src/ folder** : If your application has `src/` folder, pass `true` as the third parameter.

```TS
return multiMiddlewareHandler(request, ["logging.ts", "auth.ts"], true);
```
