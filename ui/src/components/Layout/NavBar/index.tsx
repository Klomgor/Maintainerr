import {
  ArchiveIcon,
  ClipboardCheckIcon,
  CogIcon,
  EyeIcon,
  XIcon,
} from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useRef } from 'react'
import Transition from '../../Transition'

interface NavBarLink {
  key: string
  href: string
  selected: boolean
  svgIcon: ReactNode
  name: string
}

let navBarItems: NavBarLink[] = [
  {
    key: '0',
    href: '/overview',
    selected: false,
    svgIcon: <EyeIcon className="mr-3 h-6 w-6" />,
    name: 'Overview',
  },
  {
    key: '1',
    href: '/rules',
    selected: false,
    svgIcon: <ClipboardCheckIcon className="mr-3 h-6 w-6" />,
    name: 'Rules',
  },
  {
    key: '2',
    href: '/collections',
    selected: false,
    svgIcon: <ArchiveIcon className="mr-3 h-6 w-6" />,
    name: 'Collections',
  },
  {
    key: '3',
    href: '/settings',
    selected: false,
    svgIcon: <CogIcon className="mr-3 h-6 w-6" />,
    name: 'Settings',
  },
]

interface NavBarProps {
  open?: boolean
  setClosed: () => void
}

const NavBar: React.FC<NavBarProps> = ({ open, setClosed }) => {
  const navRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    console.log(window.location.pathname)
    if (window.location.pathname !== '/') setHighlight(window.location.pathname)
    else setHighlight(`/overview`)
  }, [])

  const setHighlight = (href: string, closed = false) => {
    navBarItems = navBarItems.map((el) => {
      el.selected = href.includes(el.href)
      return el
    })

    if (closed) {
      setClosed()
    }
  }

  return (
    <div>
      <div className="lg:hidden">
        <Transition show={open}>
          <div className="fixed inset-0 z-40 flex">
            <Transition
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0">
                <div className="absolute inset-0 bg-zinc-900 opacity-90"></div>
              </div>
            </Transition>
            <Transition
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <>
                <div className="sidebar relative flex w-full max-w-xs flex-1 flex-col bg-zinc-800">
                  <div className="sidebar-close-button absolute top-0 right-0 -mr-14 p-1">
                    <button
                      className="flex h-12 w-12 items-center justify-center rounded-full text-white focus:bg-zinc-600 focus:outline-none"
                      aria-label="Close sidebar"
                      onClick={() => setClosed()}
                    >
                        <XIcon className="h-6 w-6 text-white" />
                    </button>
                  </div>
                  <div
                    ref={navRef}
                    className="flex h-0 flex-1 flex-col overflow-y-auto pt-4 pb-8 sm:pb-4"
                  >
                    <div className="flex flex-shrink-0 items-center px-2">
                      <span className="px-4 text-xl text-zinc-50">
                        <a href="/">
                          <img src="/logo.svg" alt="Logo" />
                        </a>
                      </span>
                    </div>
                    <nav className="mt-12 flex-1 space-y-4 px-4">
                      {navBarItems.map((link) => {
                        return (
                          <Link key={link.key} href={link.href}>
                            <a
                              onClick={() => setHighlight(link.href, true)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setHighlight(link.href, true)
                                }
                              }}
                              role="button"
                              tabIndex={0}
                              className={`flex items-center rounded-md px-2 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out focus:outline-none
                              ${
                                link.selected
                                  ? 'bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700'
                                  : 'hover:bg-zinc-700'
                              }`}
                            >
                              {link.svgIcon}
                              {link.name}
                            </a>
                          </Link>
                        )
                      })}
                    </nav>
                  </div>
                </div>
                <div className="w-14 flex-shrink-0">
                  {/* <!-- Force sidebar to shrink to fit close icon --> */}
                </div>
              </>
            </Transition>
          </div>
        </Transition>
      </div>

      <div className="fixed top-0 bottom-0 left-0 z-30 hidden lg:flex lg:flex-shrink-0">
        <div className="sidebar flex w-64 flex-col">
          <div className="flex h-0 flex-1 flex-col">
            <div className="flex flex-1 flex-col overflow-y-auto pt-4 pb-4">
              <div className="flex flex-shrink-0 items-center">
                <span className="px-4 text-2xl text-zinc-50">
                  <a href="/">
                    <img src="/logo.svg" alt="Logo" />
                  </a>
                </span>
              </div>
              <nav className="mt-12 flex-1 space-y-4 px-4">
                {navBarItems.map((navBarLink) => {
                  return (
                    <Link
                      key={`desktop-${navBarLink.key}`}
                      href={navBarLink.href}
                    >
                      <a
                        onClick={() => setHighlight(navBarLink.href)}
                        className={`group flex items-center rounded-md px-2 py-2 text-lg font-medium leading-6 text-white transition duration-150 ease-in-out ${
                          navBarLink.selected
                            ? 'bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700'
                            : 'hover:bg-zinc-700'
                        }
                        focus:bg-amber-800 focus:outline-none
                      `}
                      >
                        {navBarLink.svgIcon}
                        {navBarLink.name}
                      </a>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
