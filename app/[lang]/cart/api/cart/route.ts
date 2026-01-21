import { NextRequest, NextResponse } from "next/server";

/**
 * Cookie tabanlı sepet yönetimi API'si
 * Cookie adı: shopilens-cart
 */

const COOKIE_NAME = "shopilens-cart";

export async function GET(request: NextRequest) {
    const cartCookie = request.cookies.get(COOKIE_NAME);
    const cart = cartCookie ? JSON.parse(cartCookie.value) : [];
    return NextResponse.json({ data: cart, success: true });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { product, quantity = 1 } = body;

        const cartCookie = request.cookies.get(COOKIE_NAME);
        let cart = cartCookie ? JSON.parse(cartCookie.value) : [];

        // Ürün zaten var mı kontrol et
        const existingItemIndex = cart.findIndex((item: any) => item.product.id === product.id);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ product, quantity });
        }

        const response = NextResponse.json({ data: cart, success: true });

        // Cookie'yi güncelle (30 gün geçerli)
        response.cookies.set(COOKIE_NAME, JSON.stringify(cart), {
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
            sameSite: "lax",
        });

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: "Geçersiz istek" }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    const cartCookie = request.cookies.get(COOKIE_NAME);
    let cart = cartCookie ? JSON.parse(cartCookie.value) : [];

    if (productId) {
        // Belirli ürünü sil
        cart = cart.filter((item: any) => item.product.id !== parseInt(productId));
    } else {
        // Tüm sepeti temizle
        cart = [];
    }

    const response = NextResponse.json({ data: cart, success: true });
    response.cookies.set(COOKIE_NAME, JSON.stringify(cart), {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
    });

    return response;
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, quantity } = body;

        const cartCookie = request.cookies.get(COOKIE_NAME);
        let cart = cartCookie ? JSON.parse(cartCookie.value) : [];

        const itemIndex = cart.findIndex((item: any) => item.product.id === productId);

        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart = cart.filter((item: any) => item.product.id !== productId);
            } else {
                cart[itemIndex].quantity = quantity;
            }
        }

        const response = NextResponse.json({ data: cart, success: true });
        response.cookies.set(COOKIE_NAME, JSON.stringify(cart), {
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
            sameSite: "lax",
        });

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: "Geçersiz istek" }, { status: 400 });
    }
}
