// Main Logo Icon Component
export default function Logo({ className = "", size = 48, alt = "Ready4Hire logo" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            alt={alt}
        >
            <defs>
                <linearGradient id="arrowGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#629FAD" />
                    <stop offset="100%" stopColor="#296374" />
                </linearGradient>
            </defs>

            {/* Arrow shaft */}
            <line x1="24" y1="36" x2="24" y2="12" stroke="url(#arrowGradient)" strokeWidth="3" strokeLinecap="round" />

            {/* Arrow head - upper triangle */}
            <path
                d="M 24 12 L 16 24 L 24 22 L 32 24 Z"
                fill="url(#arrowGradient)"
            />

            {/* Accent circle */}
            <circle cx="24" cy="24" r="18" fill="none" stroke="url(#arrowGradient)" strokeWidth="1.5" opacity="0.3" />
        </svg>
    );
}

// Vertical layout for hero sections
export function LogoWithWordmark({ className = "", iconSize = 64 }) {
    return (
        <div className={`flex flex-col items-center gap-3 ${className}`}>
            <div className="hover:-translate-y-2 transition-transform duration-300">
                <svg
                    width={iconSize}
                    height={iconSize}
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="arrowGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#629FAD" />
                            <stop offset="100%" stopColor="#296374" />
                        </linearGradient>
                    </defs>
                    <line x1="24" y1="36" x2="24" y2="12" stroke="url(#arrowGradient2)" strokeWidth="3" strokeLinecap="round" />
                    <path
                        d="M 24 12 L 16 24 L 24 22 L 32 24 Z"
                        fill="url(#arrowGradient2)"
                    />
                    <circle cx="24" cy="24" r="18" fill="none" stroke="url(#arrowGradient2)" strokeWidth="1.5" opacity="0.3" />
                </svg>
            </div>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-[#629FAD]">
                    Ready4Hire
                </h1>
            </div>
        </div>
    );
}

// Horizontal layout for navbar
export function LogoHorizontal({ className = "", iconSize = 40 }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="arrowGradient3" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#629FAD" />
                        <stop offset="100%" stopColor="#296374" />
                    </linearGradient>
                </defs>
                <line x1="24" y1="36" x2="24" y2="12" stroke="url(#arrowGradient3)" strokeWidth="3" strokeLinecap="round" />
                <path
                    d="M 24 12 L 16 24 L 24 22 L 32 24 Z"
                    fill="url(#arrowGradient3)"
                />
                <circle cx="24" cy="24" r="18" fill="none" stroke="url(#arrowGradient3)" strokeWidth="1.5" opacity="0.3" />
            </svg>
            <span className="font-bold text-lg text-[#629FAD] hidden sm:inline">
                Ready4Hire
            </span>
        </div>
    );
}

// Compact icon
export function LogoCompact({ className = "", size = 40 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="arrowGradient4" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#629FAD" />
                    <stop offset="100%" stopColor="#296374" />
                </linearGradient>
            </defs>
            <line x1="24" y1="36" x2="24" y2="12" stroke="url(#arrowGradient4)" strokeWidth="3" strokeLinecap="round" />
            <path
                d="M 24 12 L 16 24 L 24 22 L 32 24 Z"
                fill="url(#arrowGradient4)"
            />
            <circle cx="24" cy="24" r="18" fill="none" stroke="url(#arrowGradient4)" strokeWidth="1.5" opacity="0.3" />
        </svg>
    );
}




