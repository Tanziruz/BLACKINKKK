"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <section className="min-h-dvh flex flex-col items-center justify-center px-6 text-center gap-6 bg-bg">
            <div className="flex flex-col items-center gap-4 max-w-md">
                <div className="w-fit bg-black/6 rounded-full px-3.5 py-1.5">
                    <p className="font-Ronzino-Medium text-black text-[12px] lg:text-[13px] tracking-[-0.025em] leading-[1.4em] mb-0!">
                        Something went wrong
                    </p>
                </div>
                <h2 className="text-[28px]! sm:text-[36px]! mb-0!">
                    Oops, an error occurred
                </h2>
                <p className="t16 mb-0! text-center">
                    Something unexpected happened. Try refreshing the page or go back to the homepage.
                </p>
                <div className="flex items-center gap-3 flex-wrap justify-center pt-2">
                    <button
                        onClick={reset}
                        className="btn2 btn-anim"
                    >
                        <span className="btn-label">
                            <div className="btn-label-primary">Try Again</div>
                            <div className="btn-label-secondary">Try Again</div>
                        </span>
                    </button>
                    <Link href="/">
                        <button className="btn1 btn-anim">
                            <span className="btn-label">
                                <div className="btn-label-primary">Back to Home</div>
                                <div className="btn-label-secondary">Back to Home</div>
                            </span>
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
