import Layout from "@/components/Layout";
import MainModal from "@/components/MainModal";
import { AppProvider } from "@/context";
import "@/styles/globals.scss";
import { Nunito, Roboto } from "next/font/google";
import { useEffect, useState } from "react";

const nunito = Nunito({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function App({ Component, pageProps }) {
  const [needLayout, setNeedLayout] = useState();

  useEffect(() => {
    setNeedLayout(() => {
      switch (Component.name) {
        case "Login":
          return false;
        default:
          return true;
      }
    });
  }, [Component.name]);

  return (
    <AppProvider>
      <main className={`${nunito.variable} ${roboto.variable}`}>
        {needLayout ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
        <MainModal />
      </main>
    </AppProvider>
  );
}
