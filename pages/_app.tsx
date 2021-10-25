import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Main from '../layouts/main'
import { useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState(null)
  return ( 
    <Main user={user}>
        <Component {...pageProps} />
    </Main>
  )
}
export default MyApp
