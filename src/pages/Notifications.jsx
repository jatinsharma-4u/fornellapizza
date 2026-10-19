import { Gift, Megaphone, Package, Tag } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import Reveal from '../components/ui/Reveal'
import { notifications } from '../data/site'
import { cn } from '../lib/format'
import { useStore } from '../store/StoreProvider'

const kinds = {
  deal: { icon: Tag, tint: 'bg-saffron-50 text-[#8a5a00]', to: '/offers' },
  order: { icon: Package, tint: 'bg-basil-50 text-basil', to: '/orders' },
  news: { icon: Megaphone, tint: 'bg-tomato-50 text-tomato', to: '/order' },
  reward: { icon: Gift, tint: 'bg-cream-3 text-ink', to: '/profile' },
}

export default function Notifications() {
  const { notificationsRead, markNotificationsRead } = useStore()
  // Opening the inbox marks everything read (after first paint so unread dots are visible once)
  useEffect(() => {
    const t = setTimeout(markNotificationsRead, 1200)
    return () => clearTimeout(t)
  }, [markNotificationsRead])

  return (
    <>
      <PageHeader title="Notifications" crumbs={[{ to: '/profile', label: 'Account' }, { label: 'Notifications' }]} />
      <div className="container-x max-w-2xl pt-1 md:pt-0">
        <ul className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-white">
          {notifications.map((n, i) => {
            const k = kinds[n.kind]
            return (
              <Reveal as="li" key={n.id} delay={i * 0.04} y={10}>
                <Link to={k.to} className="flex gap-3.5 p-4 transition-colors hover:bg-cream">
                  <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', k.tint)}><k.icon size={19} weight="fill" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-[14.5px] font-semibold">
                      {n.title}
                      {!notificationsRead && i < 2 && <span className="size-2 shrink-0 rounded-full bg-tomato" aria-label="Unread" />}
                    </span>
                    <span className="mt-0.5 block text-[13.5px] text-ink-2">{n.body}</span>
                    <span className="mt-1 block text-[12px] text-ink-3">{n.time}</span>
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </ul>
        <p className="mt-5 text-center text-[13px] text-ink-3">
          Manage what we send you in <Link to="/profile?tab=settings" className="font-semibold text-tomato">notification settings</Link>.
        </p>
      </div>
    </>
  )
}
