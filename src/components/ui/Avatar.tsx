import React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

const sizeMap = {
    sm: 32,
    md: 48,
    lg: 96,
    xl: 180,
} as const;

export interface AvatarProps {
    src?: string | null;
    alt?: string;
    size?: keyof typeof sizeMap;
    className?: string;
}

export function Avatar({ src, alt = "", size = "md", className }: AvatarProps) {
    const px = sizeMap[size];
    return (
        <span
            className={cn("inline-block overflow-hidden rounded-full bg-gray-300 shrink-0", className)}
            style={{ width: px, height: px }}
        >
            {src && (
                <Image src={src} alt={alt} width={px} height={px} className="h-full w-full object-cover" unoptimized />
            )}
        </span>
    );
}

export default Avatar;
