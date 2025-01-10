import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

async function main() {
    try {
        // 1. Get all active products
        const products = await stripe.products.list({
            active: true,
        });

        console.log('\nCurrent Active Products:');
        products.data.forEach(p => {
            console.log(`\n${p.name} (${p.id})`);
            console.log('Metadata:', p.metadata);
        });

        // 2. Update products with correct metadata
        console.log('\nUpdating products with metadata...');

        for (const product of products.data) {
            const isStarterPack = product.name.toLowerCase().includes('starter');
            
            // Prepare metadata
            const metadata = {
                ...product.metadata,
                isAddon: isStarterPack ? 'false' : 'true',
                isSubscription: 'false', // Set this based on your needs
                features: product.metadata.features || JSON.stringify([
                    'Feature 1',
                    'Feature 2',
                    'Feature 3',
                ]),
            };

            // Update product
            await stripe.products.update(product.id, {
                metadata,
            });

            console.log(`Updated ${product.name} with metadata:`, metadata);
        }

        console.log('\nAll products updated successfully!');
        
    } catch (error) {
        console.error('Error:', error);
    }
}

main(); 