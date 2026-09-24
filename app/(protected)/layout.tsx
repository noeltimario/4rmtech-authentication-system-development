import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) { const session=await auth.api.getSession({headers:await headers()}); if(!session?.user) redirect('/login'); return <AppShell role={(session.user as {role?:string}).role || 'staff'} name={session.user.name}>{children}</AppShell> }
