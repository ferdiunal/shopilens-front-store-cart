import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CartClient } from "./client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

interface CartPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({
    params,
}: CartPageProps): Promise<Metadata> {
    const { lang } = await params;
    const t = await getTranslations({ locale: lang, namespace: "meta" });

    return {
        title: t('cartTitle'),
        description: t('cartDescription'),
    };
}

export default async function CartPage({ params }: CartPageProps) {
    const { lang } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect(`/${lang}/auth/login?callbackUrl=/${lang}/cart`);
    }

    return <CartClient lang={lang} />;
}
