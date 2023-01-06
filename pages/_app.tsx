import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Main from "../layouts/main";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";

import "./i18n";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <Main user={session}>
          <Component {...pageProps} />
        </Main>
      </SessionProvider>
    </ChakraProvider>
  );
}
export default MyApp;
