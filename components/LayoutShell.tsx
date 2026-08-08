"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Server components (NavWrapper, Footer) are passed as props from the root layout
// so they still render on the server while this client component controls visibility.
export default function LayoutShell({
    children,
    nav,
    footer,
}: {
    children: React.ReactNode;
    nav: React.ReactNode;
    footer: React.ReactNode;
}) {
    const pathname = usePathname();
    const previousPathname = useRef(pathname);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const isAdmin = pathname.startsWith("/admin");

    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;

            if (!link) return;
            if (link.target && link.target !== "_self") return;
            if (event.defaultPrevented) return;

            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin) return;
            if (url.pathname === window.location.pathname && url.hash === window.location.hash) return;

            setIsLoading(true);
        };

        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, []);

    useEffect(() => {
        if (previousPathname.current === pathname) return;

        previousPathname.current = pathname;

        if (hideTimer.current) clearTimeout(hideTimer.current);

        hideTimer.current = setTimeout(() => {
            setIsLoading(false);
        }, 250);

        return () => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
    }, [pathname]);

    return (
        <>
            {isLoading && (
                <div className="pointer-events-none fixed left-0 top-0 z-9999 h-1 w-full overflow-hidden bg-black/5">
                    <div className="h-full w-1/3 bg-white animate-[loading-bar_1.1s_ease-in-out_infinite]" />
                </div>
            )}
            {!isAdmin && nav}
            {children}
            {!isAdmin && footer}
        </>
    );
}
