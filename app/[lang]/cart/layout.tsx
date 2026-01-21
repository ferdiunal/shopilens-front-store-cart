import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { AuthProvider } from "@/components/providers/session-provider";
import { StoreProvider } from "@/lib/store/provider";
import { Header } from "@/components/layout/header-wrapper";
import { Footer } from "@/components/layout/footer";

interface LanguageLayoutProps {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}

export default async function LanguageLayout({ children, params }: LanguageLayoutProps) {
    const { lang } = await params;

    // Geçersiz locale kontrolü
    if (!locales.includes(lang as Locale)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <AuthProvider>
            <StoreProvider>
                <NextIntlClientProvider messages={messages} locale={lang}>
                    <Header lang={lang} />
                    <main className="flex-grow">{children}</main>
                    <Footer lang={lang} />
                </NextIntlClientProvider>
            </StoreProvider>
        </AuthProvider>
    );
}
