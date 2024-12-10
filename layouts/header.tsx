import Head from "next/head";

type HeaderProps = {
    title: string,
    description: string,
    icon?: string
}
export default function Header({title, description, icon}:HeaderProps){ 
    return <>
            <Head>
                    <title>{title}</title>
                    <meta
                    name="description"
                    content="A page on the Coding Beauty website"
                    />
            </Head>
        </>
}