import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { CartProvider } from "@/lib/shop/cart";

import appCss from "../styles.css?url";
import footerBrandCss from "../footer-brand.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Go home</Link>
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
      { title: "Glass Maind" },
      { name: "description", content: "Glass Maind. Estratégia, identidade visual e marketing para marcas que querem parecer maiores, vender melhor e serem lembradas." },
      { name: "author", content: "Glass Maind" },
      { property: "og:title", content: "Glass Maind" },
      { property: "og:description", content: "Glass Maind. Estratégia, identidade visual e marketing para marcas que querem parecer maiores, vender melhor e serem lembradas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Glass Maind" },
      { name: "twitter:description", content: "Glass Maind. Estratégia, identidade visual e marketing para marcas que querem parecer maiores, vender melhor e serem lembradas." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: footerBrandCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon-glass-maind.svg?v=3" },
      { rel: "shortcut icon", type: "image/svg+xml", href: "/favicon-glass-maind.svg?v=3" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
        <script
          src="/fluxa-support.js"
          data-project-key="fluxa_pub_14671d3e72cc5168027af39875ac831ca9ef3c47703712d5b2091ac2ef47c830"
          data-brand="Suporte Glass Maind"
          data-label="Reportar problema"
          data-areas="Página inicial,Serviços,Portfólio,Contato,Orçamento,Outro"
        />
      </body>
    </html>
  );
}

function RootComponent() {
  return <CartProvider><Outlet /></CartProvider>;
}
