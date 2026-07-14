import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { CartProvider } from "@/lib/shop/cart";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Agencia Glass Maind" },
      { name: "description", content: "Agência Glass Maind. Estratégia, identidade visual e marketing para marcas que querem parecer maiores, vender melhor e serem lembradas." },
      { name: "author", content: "Agência Glass Maind" },
      { property: "og:title", content: "Agencia Glass Maind" },
      { property: "og:description", content: "Agência Glass Maind. Estratégia, identidade visual e marketing para marcas que querem parecer maiores, vender melhor e serem lembradas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Agencia Glass Maind" },
      { name: "twitter:description", content: "Agência Glass Maind. Estratégia, identidade visual e marketing para marcas que querem parecer maiores, vender melhor e serem lembradas." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3c4e8bdc-71c8-42df-bb57-19f508ece5f7/id-preview-af8229f3--55331a3a-67ae-4504-a639-3d1d14d9eaba.lovable.app-1777233683195.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3c4e8bdc-71c8-42df-bb57-19f508ece5f7/id-preview-af8229f3--55331a3a-67ae-4504-a639-3d1d14d9eaba.lovable.app-1777233683195.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  );
}
