import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import './styles/Global.css';
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}