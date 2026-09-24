import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = { title: '4RMTECH Gadgets Shop | Operations', description: 'Secure inventory and order operations for 4RMTECH Gadgets Shop.', generator: 'v0.app', icons: { icon: '/icon.svg', apple: '/apple-icon.png' } }
export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#071326' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
