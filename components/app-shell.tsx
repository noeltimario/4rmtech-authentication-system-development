'use client'

import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function AppShell({ children, role, name }: { children: React.ReactNode; role: string; name: string }) {
 const path=usePathname(); const router=useRouter(); const [open,setOpen]=useState(false); const admin=role==='admin'
 const links=[{href:'/dashboard',label:'Overview',icon:LayoutDashboard},{href:admin?'/admin/dashboard':'/staff/dashboard',label:admin?'Admin control':'Staff workspace',icon:Package},{href:'/orders',label:'Orders',icon:ShoppingCart},...(admin?[{href:'/staff',label:'Team access',icon:Users}]:[])]
 async function logout(){await authClient.signOut();router.push('/login');router.refresh()}
 return <div className="app-frame"><aside className={open?'sidebar open':'sidebar'}><div className="brand"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-NLV1vD6RkAzBACD587Bh8jYDExGFCf.png" alt="4RMTECH Gadgets Shop" /><span>OPERATIONS</span></div><nav>{links.map(({href,label,icon:Icon})=><a key={href} href={href} className={path===href?'active':''}><Icon data-icon="inline-start" />{label}</a>)}</nav><button className="logout" onClick={logout}><LogOut data-icon="inline-start"/>Sign out</button></aside><div className="main-area"><header className="topbar"><button className="menu-btn" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button><div><p className="eyebrow">4RMTECH GADGETS SHOP</p><p className="welcome">Good day, {name}</p></div><div className="role-pill">{role}</div></header><main className="content">{children}</main></div></div>
}
