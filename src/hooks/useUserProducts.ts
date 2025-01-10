import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { UserProducts } from '@/types/product';

export function useUserProducts() {
    const { data: session } = useSession();

    const { data: products, isLoading, error, refetch } = useQuery<UserProducts>({
        queryKey: ['userProducts', session?.user?.id],
        queryFn: async () => {
            if (!session?.user?.id) {
                return { addons: [] };
            }

            const response = await axios.get('/api/user/products');
            return response.data;
        },
        enabled: !!session?.user?.id
    });

    return {
        products: products || { addons: [] },
        isLoading,
        error,
        refetch
    };
} 