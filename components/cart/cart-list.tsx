"use client";

/**
 * Cart List Component
 * Sepetteki ürünlerin listesi
 */

import { useTranslations } from "next-intl";
import { ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { CartItem } from "./cart-item";
import { useCart } from "@/lib/hooks/use-cart";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCartItems } from "@/lib/store/slices/cart.slice";

interface CartListProps {
    lang: string;
}

export function CartList({ lang }: CartListProps) {
    const t = useTranslations("cart");
    const { isLoading, updateItemQuantity, removeFromCart } = useCart();
    const items = useAppSelector(selectCartItems);

    const handleUpdateQuantity = (productId: number, quantity: number) => {
        updateItemQuantity(productId, quantity);
    };

    const handleRemove = (productId: number) => {
        removeFromCart(productId);
    };

    if (isLoading && items.length === 0) {
        return (
            <div className="bg-card border border-border rounded-lg p-8 flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    // Boş sepet
    if (items.length === 0) {
        return (
            <div className="bg-card border border-border rounded-lg p-8">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <ShoppingBag className="size-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                        {t("empty")}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                        {t("emptyDescription")}
                    </p>
                    <Link
                        href={`/${lang}/products`}
                        className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        {t("continueShopping")}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                    {t("title")} ({items.length})
                </h2>
            </div>

            <div className="divide-y relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader2 className="size-6 animate-spin text-primary" />
                    </div>
                )}
                {items.map((item) => (
                    <CartItem
                        key={item.product.id}
                        item={item}
                        lang={lang}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemove}
                    />
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
                <Link
                    href={`/products`} // Multi-zone: Root'a yönlendir, o ana uygulamaya gider
                    className="text-primary hover:underline inline-flex items-center gap-1"
                >
                    ← {t("continueShopping")}
                </Link>
            </div>
        </div>
    );
}
