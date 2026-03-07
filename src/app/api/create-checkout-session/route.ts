import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe-server";
import { toStripeAmount } from "@/app/lib/stripe";

// Define the CartItem type
interface CartItem {
  name: string;
  price: number;
  priceSubtext: string;
  quantity: number;
  // Add other fields if needed
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Ensure URL has proper scheme
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_APP_URL
      : `https://${process.env.NEXT_PUBLIC_APP_URL}`;

    const body = await request.json();
    const { items, customerInfo } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    if (!customerInfo) {
      return NextResponse.json(
        { error: "Customer information is required" },
        { status: 400 },
      );
    }

    // Create line items for Stripe
    const lineItems = (items as CartItem[]).map((item) => ({
      price_data: {
        currency: "myr",
        product_data: {
          name: item.name,
          description: item.priceSubtext,
          images: [], // You can add product images here
        },
        unit_amount: toStripeAmount(item.price),
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const sessionConfig = {
      payment_method_types: ["card" as const],
      line_items: lineItems,
      mode: "payment" as const,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        customerNotes: customerInfo.notes || "",
        orderItems: JSON.stringify(items),
      },
      shipping_address_collection: {
        allowed_countries: ["MY" as const], // Only Malaysia
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount" as const,
            fixed_amount: {
              amount: 0, // Free shipping
              currency: "myr",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day" as const,
                value: 3,
              },
              maximum: {
                unit: "business_day" as const,
                value: 7,
              },
            },
          },
        },
      ],
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("STRIPE_SECRET_KEY")) {
        return NextResponse.json(
          { error: "Payment service configuration error" },
          { status: 500 },
        );
      }

      if (error.message.includes("Invalid API key")) {
        return NextResponse.json(
          { error: "Payment service configuration error" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
