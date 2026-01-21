"use client";

import { Header as BaseHeader } from "./header";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCartItemCount } from "@/lib/store/slices/cart.slice";

interface HeaderWrapperProps {
    lang: string;
}

export function Header(props: HeaderWrapperProps) {
    const itemCount = useAppSelector(selectCartItemCount);

    return <BaseHeader {...props} cartItemCount={itemCount} />;
}
