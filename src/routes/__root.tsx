import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Banner } from '../components/Banner'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Banner />
        <Outlet />
      </div>
    </main>
  )
}
