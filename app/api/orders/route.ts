import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

interface OrderPayload {
  paypalOrderId: string;
  packageId: string;
  packageName: string;
  amount: number; // in dollars
  addOns?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  payerEmail?: string;
  payerName?: string;
  status: string;
}

// GET /api/orders - Get all orders (admin only)
export async function GET() {
  // Check authentication
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) return authResult

  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order after PayPal payment
export async function POST(request: NextRequest) {
  // Check authentication
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) return authResult

  try {
    const data: OrderPayload = await request.json();

    // Calculate add-ons total
    const addOnsTotal = data.addOns?.reduce(
      (sum, addon) => sum + addon.price * addon.quantity,
      0
    ) || 0;

    // Convert dollars to cents for storage
    const packagePriceCents = Math.round(data.amount * 100);
    const addOnsTotalCents = Math.round(addOnsTotal * 100);
    const totalAmountCents = packagePriceCents + addOnsTotalCents;

    // Create the order
    const order = await prisma.order.create({
      data: {
        paypalOrderId: data.paypalOrderId,
        paypalStatus: data.status,
        payerEmail: data.payerEmail || null,
        payerName: data.payerName || null,
        packageId: data.packageId,
        packageName: data.packageName,
        packagePrice: packagePriceCents,
        addOns: data.addOns ? JSON.stringify(data.addOns) : null,
        addOnsTotal: addOnsTotalCents,
        totalAmount: totalAmountCents,
        status: 'paid',
      },
    });

    console.log('Order created:', order.id, 'PayPal:', data.paypalOrderId);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
