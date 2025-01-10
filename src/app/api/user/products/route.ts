import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getAuthSession();
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userProducts = await prisma.userProducts.findUnique({
            where: { userId: session.user.id }
        });

        if (!userProducts) {
            return NextResponse.json({ addons: [] });
        }

        return NextResponse.json(userProducts);
    } catch (error) {
        console.error('Error fetching user products:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
} 