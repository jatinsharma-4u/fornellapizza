import { AnimatePresence, motion } from 'motion/react'
import PageHeader from '../components/layout/PageHeader'
import ProductCard from '../components/product/ProductCard'
import { EmptyState } from '../components/ui/Bits'
import Button from '../components/ui/Button'
import { getProduct } from '../data/products'
import { useStore } from '../store/StoreProvider'

export default function Favorites() {
  const { favorites } = useStore()
  const list = favorites.map(getProduct).filter(Boolean)
  return (
    <>
      <PageHeader title="Your favourites" mobileTitle="Favourites" subtitle="Tap the heart on any dish to save it here." crumbs={[{ to: '/profile', label: 'Account' }, { label: 'Favourites' }]} />
      <div className="container-x">
        {list.length === 0 ? (
          <EmptyState image="/img/cone.webp" title="No favourites yet" body="Heart the dishes you love and they’ll be waiting here." action={<Button to="/order">Explore the menu</Button>} />
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {list.map((p) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}>
                  <ProductCard product={p} className="h-full" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  )
}
