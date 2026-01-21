"use client";

import { useState, useCallback, useEffect } from "react";
import type { CartItem, Product } from "@/types";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCart } from "@/lib/store/slices/cart.slice";

/**
 * shopilens-store-cart Projesi İçin useCart Hook
 * Direkt olarak projedeki /api/cart API'sini (Cookie tabanlı) kullanır.
 */
export function useCart() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // URL'den dili al (örn: /tr/cart -> tr)
    const getLang = () => {
        if (typeof window !== 'undefined') {
            const segments = window.location.pathname.split('/');
            // /tr/cart -> segments: ["", "tr", "cart"]
            return segments[1] || 'tr';
        }
        return 'tr';
    };

    const lang = getLang();
    const basePath = `/${lang}/cart`; // app/[lang]/cart dizin yapısına uygun

    const dispatch = useAppDispatch();

    const fetchCart = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${basePath}/api/cart`);
            const result = await response.json();
            if (result.success) {
                setItems(result.data);
                dispatch(setCart(result.data));
            }
        } catch (err) {
            setError("Sepet yüklenirken hata oluştu");
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (product: Product, quantity: number = 1) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${basePath}/api/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product, quantity }),
            });
            const result = await response.json();
            if (result.success) {
                setItems(result.data);
                dispatch(setCart(result.data));
                return true;
            }
            return false;
        } catch (err) {
            setError("Sepete eklenirken hata oluştu");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (productId: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${basePath}/api/cart?productId=${productId}`, {
                method: "DELETE",
            });
            const result = await response.json();
            if (result.success) {
                setItems(result.data);
                dispatch(setCart(result.data));
                return true;
            }
            return false;
        } catch (err) {
            setError("Ürün silinirken hata oluştu");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateItemQuantity = async (productId: number, quantity: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${basePath}/api/cart`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity }),
            });
            const result = await response.json();
            if (result.success) {
                setItems(result.data);
                dispatch(setCart(result.data));
                return true;
            }
            return false;
        } catch (err) {
            setError("Miktar güncellenirken hata oluştu");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const emptyCart = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${basePath}/api/cart`, {
                method: "DELETE",
            });
            const result = await response.json();
            if (result.success) {
                setItems([]);
                dispatch(setCart([]));
                return true;
            }
            return false;
        } catch (err) {
            setError("Sepet temizlenirken hata oluştu");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return {
        items,
        total,
        isLoading,
        error,
        isEmpty: items.length === 0,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        emptyCart,
        refresh: fetchCart
    };
}
