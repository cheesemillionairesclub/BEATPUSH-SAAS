import Stripe from 'stripe';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        // Create coupon idempotently (check if it already exists)
        let coupon;
        try {
            coupon = await stripe.coupons.retrieve('BEAT10_10PCT');
            console.log('Coupon already exists:', coupon.id);
        } catch (e) {
            if (e.statusCode === 404) {
                coupon = await stripe.coupons.create({
                    id: 'BEAT10_10PCT',
                    percent_off: 10,
                    duration: 'forever',
                    name: 'BEAT10 - 10% OFF',
                });
                console.log('Coupon created:', coupon.id);
            } else {
                throw e;
            }
        }

        // Create promotion code idempotently (check if BEAT10 already exists)
        const existingCodes = await stripe.promotionCodes.list({
            coupon: 'BEAT10_10PCT',
            code: 'BEAT10',
            limit: 1,
        });

        let promoCode;
        if (existingCodes.data.length > 0) {
            promoCode = existingCodes.data[0];
            console.log('Promotion code already exists:', promoCode.code);
        } else {
            promoCode = await stripe.promotionCodes.create({
                coupon: 'BEAT10_10PCT',
                code: 'BEAT10',
                active: true,
            });
            console.log('Promotion code created:', promoCode.code);
        }

        return res.status(200).json({
            success: true,
            coupon: coupon.id,
            promotion_code: promoCode.code,
            promotion_code_id: promoCode.id,
        });
    } catch (error) {
        console.error('Setup promo error:', error.message);
        return res.status(500).json({ error: 'Failed to setup promo', details: error.message });
    }
}
