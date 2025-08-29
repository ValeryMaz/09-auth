// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { parse } from "cookie";
// import { checkServerSession } from "./lib/api/serverApi";

// const privateRoutes = ["/profile", "/notes"];
// const publicRoutes = ["/sign-in", "/sign-up"];

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("accessToken")?.value;
//   const refreshToken = cookieStore.get("refreshToken")?.value;

//   const isPublicRoute = publicRoutes.some((route) =>
//     pathname.startsWith(route)
//   );
//   const isPrivateRoute = privateRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   if (!accessToken) {
//     if (refreshToken) {
//       // Якщо accessToken відсутній, але є refreshToken — потрібно перевірити сесію навіть для публічного маршруту,
//       // адже сесія може залишатися активною, і тоді потрібно заборонити доступ до публічного маршруту.
//       const data = await checkServerSession();
//       const setCookie = data.headers["set-cookie"];

//       if (setCookie) {
//         const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
//         for (const cookieStr of cookieArray) {
//           const parsed = parse(cookieStr);
//           const options = {
//             expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
//             path: parsed.Path,
//             maxAge: Number(parsed["Max-Age"]),
//           };
//           if (parsed.accessToken)
//             cookieStore.set("accessToken", parsed.accessToken, options);
//           if (parsed.refreshToken)
//             cookieStore.set("refreshToken", parsed.refreshToken, options);
//         }
//         // Якщо сесія все ще активна:
//         // для публічного маршруту — виконуємо редірект на головну.
//         if (isPublicRoute) {
//           return NextResponse.redirect(new URL("/", request.url), {
//             headers: {
//               Cookie: cookieStore.toString(),
//             },
//           });
//         }
//         // для приватного маршруту — дозволяємо доступ
//         if (isPrivateRoute) {
//           return NextResponse.next({
//             headers: {
//               Cookie: cookieStore.toString(),
//             },
//           });
//         }
//       }
//     }
//     // Якщо refreshToken або сесії немає:
//     // публічний маршрут — дозволяємо доступ
//     if (isPublicRoute) {
//       return NextResponse.next();
//     }

//     // приватний маршрут — редірект на сторінку входу
//     if (isPrivateRoute) {
//       return NextResponse.redirect(new URL("/sign-in", request.url));
//     }
//   }

//   // Якщо accessToken існує:
//   // публічний маршрут — виконуємо редірект на головну
//   if (isPublicRoute) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }
//   // приватний маршрут — дозволяємо доступ
//   if (isPrivateRoute) {
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
// };

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  console.log("🔍 Middleware debug:", {
    pathname,
    accessToken: accessToken ? "EXISTS" : "NO",
    refreshToken: refreshToken ? "EXISTS" : "NO",
    accessTokenValue: accessToken
      ? accessToken.substring(0, 20) + "..."
      : "N/A",
    isPublicRoute,
    isPrivateRoute,
  });

  // Если нет accessToken
  if (!accessToken) {
    // Попробуем обновить токены через refreshToken
    if (refreshToken) {
      try {
        const data = await checkServerSession();
        const setCookie = data.headers["set-cookie"];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];
          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);
            const options = {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: Number(parsed["Max-Age"]),
            };
            if (parsed.accessToken)
              cookieStore.set("accessToken", parsed.accessToken, options);
            if (parsed.refreshToken)
              cookieStore.set("refreshToken", parsed.refreshToken, options);
          }

          // После успешного обновления токенов
          if (isPublicRoute) {
            // Если пользователь авторизован, перенаправляем с публичных страниц на главную
            return NextResponse.redirect(new URL("/", request.url));
          }
          if (isPrivateRoute) {
            // Разрешаем доступ к приватным страницам
            return NextResponse.next();
          }
        }
      } catch (error) {
        console.log("❌ Token refresh failed:", error);
        // Если обновление токенов не удалось, очищаем cookies
        cookieStore.delete("refreshToken");
      }
    }

    // Если это публичная страница и пользователь не авторизован - разрешаем доступ
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Если это приватная страница и пользователь не авторизован - перенаправляем на вход
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Для всех остальных страниц разрешаем доступ
    return NextResponse.next();
  }

  // Если accessToken есть
  // Если пользователь авторизован и пытается зайти на страницы входа/регистрации
  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Для всех остальных случаев разрешаем доступ
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
