import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/context/AuthContextProvider";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import { FormProvider } from "@/context/FormContextProvider";
import Script from "next/script";
import ChatwootWidget from "@/components/chatwoot";
import "../app/polyfill";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paisaintime, Apply Instant loan online, Instant Approval, Apply Now",
  description:
    "Paisaintime is a modern-age fin-tech platform aiming to foster financial inclusion through innovation to help customers with easy to access loans.",
  keywords:
    "Loan, Instant loan, Instant loan, loan apply, Online loan apply, Loan apply, loan interest rate, loans online, Online Instant Loan, Term loan, Emergency loans, lowest loan rates, Small loans no credit check, Get instant loan, Short Term Loan, loan calculator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="all" />
        <meta httpEquiv="content-type" content="text/html;charset=UTF-8" />
        {/* enable these in production */}
        <meta
          name="facebook-domain-verification"
          content="dqgq8gzpbp6gsrkaod9pwoku725aoo"
        />
        <meta
          name="p:domain_verify"
          content="0a8d6eda135b4b09115bb4c3e22cae48"
        />
        <meta
          name="google-site-verification"
          content="jzryVcaaZnuford7P0a4z9LODyOgk3Ka2DPSqZgCq2Y"
        />
      </head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=AW-10815102397"
      />
      <Script
        id="google-ads"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-10815102397');
            `,
        }}
      />
      <body className={roboto.className}>
        <Toaster />
        <ChatwootWidget />
        <AuthProvider>
          <FormProvider>
            <Navbar />
            {children}
            <Footer />
          </FormProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
