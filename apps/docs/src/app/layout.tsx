import "~/styles/globals.css";
import 'nextra-theme-docs/style.css'

import { type Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";

import { Navbar, Layout, Footer } from 'nextra-theme-docs';
import { Banner, Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';

export const metadata: Metadata = {
    title: "Role-Based Ban Protection",
    description: "Protect your discord server from spam and abuse",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
});

const banner = <Banner storageKey="oh-boy"></Banner>;
const navbar = (<Navbar logo={<b>RBBP</b>} />)

const footer = (<Footer>MIT {new Date().getFullYear()} &copy; <Link href="https://zedsoftworks.dev">Zed Softworks LLC</Link></Footer>);

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${geist.variable}`} dir="ltr" suppressHydrationWarning>
            <Head />
            <body>
                <Layout
                    banner={banner}
                    navbar={navbar}
                    pageMap={await getPageMap()}
                    docsRepositoryBase="https://github.com/Zed-Softworks-Official/rbbp/tree/master/apps/docs"
                    footer={footer}
                >
                    {children}
                </Layout>
            </body>
        </html>
    );
}
