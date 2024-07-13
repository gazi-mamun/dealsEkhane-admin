import Layout from "@/components/Layout";
import MainModal from "@/components/MainModal";
import { AppProvider } from "@/context";
import "@/styles/globals.scss";
import { Nunito, Roboto } from "next/font/google";
import { useRouter } from "next/router";
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

  const router = useRouter();

  useEffect(() => {
    setNeedLayout(() => {
      switch (router.pathname) {
        case "/login":
          return false;
        default:
          return true;
      }
    });
  }, [router.pathname]);

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
