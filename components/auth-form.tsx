'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

type LoginRole = 'staff' | 'admin'

export function AuthForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<LoginRole>('staff')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)

    const result = mode === 'login'
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ email, password, name })

    if (result.error) {
      setBusy(false)
      setError('Unable to authenticate. Check your email and password, then try again.')
      return
    }

    const session = await authClient.getSession()
    const accountRole = (session.data?.user as { role?: LoginRole } | undefined)?.role ?? 'staff'

    if (mode === 'login' && role === 'admin' && accountRole !== 'admin') {
      await authClient.signOut()
      setBusy(false)
      setError('This account does not have administrator access. Choose Staff access or use an admin account.')
      return
    }

    setBusy(false)
    router.push(accountRole === 'admin' ? '/admin/dashboard' : '/staff/dashboard')
    router.refresh()
  }

  function switchMode() {
    setMode((current) => current === 'login' ? 'signup' : 'login')
    setError('')
  }

  return (
    <form onSubmit={submit} className="auth-form flex flex-col gap-4">
      {mode === 'login' && (
        <fieldset className="role-picker">
          <legend>Sign in as</legend>
          <div className="role-options">
            <label className={role === 'staff' ? 'role-option selected' : 'role-option'}>
              <input type="radio" name="role" value="staff" checked={role === 'staff'} onChange={() => setRole('staff')} />
              <span><strong>Staff workspace</strong><small>Orders, inventory, and daily tasks</small></span>
            </label>
            <label className={role === 'admin' ? 'role-option selected' : 'role-option'}>
              <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} />
              <span><strong>Admin control</strong><small>Team access and full operations</small></span>
            </label>
          </div>
        </fieldset>
      )}
      {mode === 'signup' && <label className="field"><span>Full name</span><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>}
      <label className="field"><span>Work email</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" autoComplete="email" /></label>
      <label className="field"><span>Password</span><input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="primary-btn" disabled={busy}>{busy ? 'Authenticating…' : mode === 'login' ? `Continue to ${role === 'admin' ? 'admin control' : 'staff workspace'}` : 'Create staff account'}</button>
      <button type="button" className="switch-btn" onClick={switchMode}>{mode === 'login' ? 'Need a staff account? Create one' : 'Already registered? Sign in'}</button>
    </form>
  )
}

