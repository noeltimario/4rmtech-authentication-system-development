'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm() {
  const router = useRouter(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [name, setName] = useState(''); const [mode, setMode] = useState<'login'|'signup'>('login'); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) { event.preventDefault(); setError(''); setBusy(true); const result = mode === 'login' ? await authClient.signIn.email({ email, password }) : await authClient.signUp.email({ email, password, name }); setBusy(false); if (result.error) { setError('Unable to authenticate. Check your details and try again.'); return }; router.push('/dashboard'); router.refresh() }
  return <form onSubmit={submit} className="flex flex-col gap-4">{mode === 'signup' && <label className="field"><span>Full name</span><input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" /></label>}<label className="field"><span>Email address</span><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" /></label><label className="field"><span>Password</span><input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" /></label>{error && <p className="error" role="alert">{error}</p>}<button className="primary-btn" disabled={busy}>{busy ? 'Authenticating…' : mode === 'login' ? 'Sign in securely' : 'Create staff account'}</button><button type="button" className="switch-btn" onClick={()=>setMode(mode==='login'?'signup':'login')}>{mode==='login' ? 'Need a staff account? Create one' : 'Already registered? Sign in'}</button></form>
}
