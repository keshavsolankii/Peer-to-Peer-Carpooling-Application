import express, { json } from "express";
const Payment = express();
import cors from "cors";
import Stripe from "stripe";
const stripe = new Stripe("sk_test_51PAHO2SHVRpWe0M6AKSKlkbtRqlsQv6pzGGU5fBM77fyLprfgmFPSyekligMEyXfXGumMSzQG6pXMpHFlgYrF0is00f28Wn8cL");

Payment.use(json());
Payment.use(cors());

//checkout api
Payment.post("/api/create-checkout-session", async (req, res) => {
    const { prices } = req.body;

    const lineItems = prices.map((price) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: price.fname
            },
            unit_amount: price.cost * 100,
        },
        quantity: price.qnty
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        // line_items: [
        //     {
        //       price: prices,
        //       quantity: 1,
        //     },
        //   ],
        mode: "payment",
        success_url: `http://localhost:5173/success/${prices[0].driverid}/${prices[0].userid}/${prices[0].qnty}`,
        cancel_url: "http://localhost:5173/cancel",
    })

    res.json({ id: session.id })

})

Payment.listen(7000, () => {
    console.log("server start")
})