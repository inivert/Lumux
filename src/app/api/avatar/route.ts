import { NextResponse } from "next/server";

function getInitials(name: string): string {
    if (!name) return "U";
    return name
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function generateSVG(initials: string, size: number = 200): string {
    // Sanitize inputs
    const safeInitials = initials.replace(/[<>]/g, '');
    const safeSize = Math.max(32, Math.min(400, size));

    // Generate a consistent color based on the initials
    const colors = ['#0D8ABC', '#2563EB', '#7C3AED', '#DB2777', '#059669', '#DC2626'];
    const colorIndex = safeInitials.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const backgroundColor = colors[colorIndex];

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${safeSize}" height="${safeSize}" viewBox="0 0 ${safeSize} ${safeSize}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${safeSize}" height="${safeSize}" fill="${backgroundColor}"/>
    <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="${safeSize * 0.4}px"
        fill="white"
        text-anchor="middle"
        dominant-baseline="central"
        font-weight="bold"
    >${safeInitials}</text>
</svg>`;

    return svg;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = decodeURIComponent(searchParams.get("name") || "User");
        const size = parseInt(searchParams.get("size") || "200");
        
        const initials = getInitials(name);
        const svg = generateSVG(initials, size);

        return new NextResponse(svg, {
            headers: {
                "Content-Type": "image/svg+xml",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Avatar generation error:", error);
        return new NextResponse("Error generating avatar", { 
            status: 500,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    }
} 