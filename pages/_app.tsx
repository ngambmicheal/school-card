import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Main from '../layouts/main'
import { useState } from 'react'
import { SessionProvider } from "next-auth/react"


function MyApp({ Component,   pageProps: { session, ...pageProps } }: AppProps) {
  return ( 
    <SessionProvider session={session}>
    <Main user={session}>
        <Component {...pageProps} />
    </Main>
    </SessionProvider>

  )
}
export default MyApp
