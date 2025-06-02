import Head from "next/head";

type HeaderProps = {
    title: string,
    description: string,
    icon: string
}

export default function Header({title, description, icon}:HeaderProps){ 
    return <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href={icon} />
            
            {/* Open Graph Tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={icon} />
            
            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={icon} />
            
            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="author" content="AcademiX" />
            <meta name="theme-color" content="#2563eb" />
            
            {/* Preconnect for performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
}