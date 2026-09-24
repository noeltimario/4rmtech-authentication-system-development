import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const customer = String(body.customer || '').trim()
    const items = Number(body.items)
    const total = Number(body.total)
    if (!customer || !Number.isInteger(items) || items < 1 || !Number.isInteger(total) || total < 0 || total > 100000000) return NextResponse.json({ error: 'Invalid order details' }, { status: 400 })
    const [order] = await db.insert(orders).values({ customer: customer.slice(0, 160), items, total, status: 'pending' }).returning({ id: orders.id })
    return NextResponse.json({ orderNumber: `4RM-${String(order.id).padStart(6, '0')}` })
  } catch {
    return NextResponse.json({ error: 'Unable to place order' }, { status: 500 })
  }
}
