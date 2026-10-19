import { AppleLogo, ArrowLeft, CheckCircle, Eye, EyeSlash, GoogleLogo, Info, WarningCircle } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Field, Logo } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import { demoUser } from '../data/site'
import { cn } from '../lib/format'
import { useStore } from '../store/StoreProvider'

const copy = {
  login: { title: 'Welcome back', sub: 'Sign in to track orders, reorder favourites and collect points.', cta: 'Sign in' },
  signup: { title: 'Create your account', sub: 'Join Fornella Club and get 20% off your first order.', cta: 'Create account' },
  forgot: { title: 'Reset your password', sub: 'Enter your email and we’ll send you a reset link.', cta: 'Send reset link' },
}

function PasswordField({ id, label, value, onChange, error, autoComplete, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Field id={id} label={label} type={show ? 'text' : 'password'} required autoComplete={autoComplete} value={value} onChange={onChange} error={error} placeholder={placeholder} />
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} className="absolute top-[26px] right-1 grid size-10 md:top-[30px] place-items-center rounded-full text-ink-3 hover:text-ink">
        {show ? <EyeSlash size={19} /> : <Eye size={19} />}
      </button>
    </div>
  )
}

function Spinner() {
  return <motion.span className="size-5 rounded-full border-[2.5px] border-white/40 border-t-white" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />
}

export default function Auth({ mode }) {
  const { login, register, socialLogin } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('next') || '/profile'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const c = copy[mode]

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
    setFormError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (mode === 'signup' && form.name.trim().length < 2) er.name = 'Tell us what to call you.'
    if (!/\S+@\S+\.\S+/.test(form.email)) er.email = 'Enter a valid email address.'
    if (mode !== 'forgot' && form.password.length < 6) er.password = 'Use at least 6 characters.'
    if (mode === 'signup' && form.confirm !== form.password) er.confirm = 'Passwords don’t match.'
    setErrors(er)
    const first = Object.keys(er)[0]
    if (first) return document.getElementById(`auth-${first}`)?.focus()

    setLoading(true)
    if (mode === 'forgot') {
      await new Promise((r) => setTimeout(r, 700))
      setLoading(false)
      return setSent(true)
    }
    const res = mode === 'signup' ? await register(form) : await login(form.email, form.password)
    setLoading(false)
    if (res.error) return setFormError(res.error)
    navigate(redirect, { replace: true })
  }

  const social = (provider) => {
    socialLogin(provider)
    navigate(redirect, { replace: true })
  }

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] md:grid-cols-2 md:grid-rows-1">
      {/* Visual panel — compact band on phones, full panel on desktop. The pizza is boxed so it is never cropped. */}
      <div className="relative h-[112px] overflow-hidden bg-tomato md:order-2 md:m-3 md:h-auto md:rounded-[28px]">
        <span className="absolute top-1/2 left-1/2 aspect-square h-[96px] -translate-x-1/2 -translate-y-[45%] md:h-auto md:w-[min(70%,460px)] md:-translate-y-1/2">
          <motion.img src="/img/pepperoni.webp" alt="" initial={{ rotate: -40, scale: 0.85, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="size-full object-contain drop-shadow-[0_24px_30px_rgba(60,10,0,0.4)]" />
        </span>
        <p className="absolute right-8 bottom-8 left-8 hidden text-center font-display text-[22px] leading-snug text-white md:block">“Best pizza in the city — and reordering my usual takes two taps.”<span className="mt-2 block font-sans text-[13px] text-white/70">Maya R., Fornella Club member</span></p>
        <Link to="/" className="absolute top-3 left-3 grid size-10 place-items-center rounded-full bg-white/95 md:hidden" aria-label="Back to home">
          <ArrowLeft weight="bold" size={17} />
        </Link>
      </div>

      {/* Form */}
      <div className="relative -mt-4 rounded-t-[20px] bg-cream px-4 pt-5 pb-6 md:mt-0 md:flex md:flex-col md:justify-center md:rounded-none md:px-12 lg:px-20">
        <Link to="/" className="mb-10 hidden w-fit md:block" aria-label="Fornella home">
          <Logo />
        </Link>
        <div className="mx-auto w-full max-w-[400px] md:mx-0">
          <AnimatePresence mode="wait">
            <motion.div key={mode + sent} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <h1 className="text-[23px] leading-tight md:text-h1">{sent ? 'Check your inbox' : c.title}</h1>
              <p className="mt-1 text-[13.5px] text-ink-2 md:text-[14.5px]">{sent ? `If an account exists for ${form.email}, a reset link is on its way.` : c.sub}</p>

              {sent ? (
                <>
                  <p className="mt-5 flex items-center gap-2 rounded-xl bg-basil-50 px-3.5 py-3 text-[13.5px] font-medium text-basil" role="status">
                    <CheckCircle size={18} weight="fill" /> Reset email sent (demo — nothing is actually sent).
                  </p>
                  <Button to="/login" size="lg" full className="mt-5">Back to sign in</Button>
                </>
              ) : (
                <>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setForm((f) => ({ ...f, email: demoUser.email, password: demoUser.password })); setErrors({}); setFormError('') }}
                      className="mt-3 flex w-full items-center gap-2.5 rounded-xl border border-dashed border-ink/20 bg-white px-3 py-2 text-left text-[12.5px] text-ink-2 hover:border-ink/40"
                    >
                      <Info size={17} className="shrink-0 text-tomato" />
                      <span>Demo account: <b className="text-ink">{demoUser.email}</b> / <b className="text-ink">{demoUser.password}</b> — tap to fill</span>
                    </button>
                  )}

                  {mode !== 'forgot' && (
                    <>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={() => social('Google')} className="h-10 bg-white"><GoogleLogo weight="bold" size={18} /> Google</Button>
                        <Button variant="outline" onClick={() => social('Apple')} className="h-10 bg-white"><AppleLogo weight="fill" size={18} /> Apple</Button>
                      </div>
                      <p className="my-3 flex items-center gap-3 text-[12px] text-ink-3"><span className="h-px flex-1 bg-line" />or with email<span className="h-px flex-1 bg-line" /></p>
                    </>
                  )}

                  <AnimatePresence>
                    {formError && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} role="alert" className="mb-3 flex items-start gap-2 overflow-hidden rounded-xl bg-tomato-50 px-3.5 py-2.5 text-[13.5px] font-medium text-tomato-600">
                        <WarningCircle size={18} weight="fill" className="mt-px shrink-0" /> {formError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <form noValidate onSubmit={submit} className={cn('space-y-3 md:space-y-3.5', mode === 'forgot' && 'mt-5')}>
                    {mode === 'signup' && <Field id="auth-name" label="Full name" required autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />}
                    <Field id="auth-email" label="Email" type="email" inputMode="email" required autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="you@email.com" />
                    {mode !== 'forgot' && (
                      <PasswordField id="auth-password" label="Password" value={form.password} onChange={set('password')} error={errors.password} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder={mode === 'signup' ? 'At least 6 characters' : undefined} />
                    )}
                    {mode === 'signup' && <PasswordField id="auth-confirm" label="Confirm password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" />}
                    {mode === 'login' && (
                      <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-[13px] font-semibold text-tomato">Forgot password?</Link>
                      </div>
                    )}
                    <Button type="submit" size="lg" full disabled={loading}>{loading ? <Spinner /> : c.cta}</Button>
                    {mode === 'signup' && (
                      <p className="text-center text-[12px] text-ink-3">
                        By continuing you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
                      </p>
                    )}
                  </form>
                </>
              )}

              <p className="mt-4 text-center text-[13.5px] text-ink-2 md:mt-6">
                {mode === 'login' ? (
                  <>New to Fornella? <Link to="/signup" className="font-semibold text-tomato">Create an account</Link></>
                ) : (
                  <>Already have an account? <Link to="/login" className="font-semibold text-tomato">Sign in</Link></>
                )}
              </p>
              <p className="mt-1.5 text-center">
                <Link to="/order" className="text-[13px] font-semibold text-ink-3 hover:text-ink">Continue as guest →</Link>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
