"use client";

import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/hooks/use-cart";
import { Product } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
    product: Product;
    className?: string;
    variant?: "default" | "secondary" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    showIcon?: boolean;
    showText?: boolean;
}

export function AddToCartButton({
    product,
    className,
    variant = "default",
    size = "default",
    showIcon = true,
    showText = true
}: AddToCartButtonProps) {
    const t = useTranslations("common");
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAdding(true);
        await addToCart(product, 1);
        setIsAdding(false);
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={cn("gap-2", className)}
            onClick={handleAddToCart}
            disabled={isAdding}
        >
            {isAdding ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                showIcon && <ShoppingCart className="size-4" />
            )}
            {showText && (isAdding ? t("adding") : t("addToCart"))}
        </Button>
    );
}
