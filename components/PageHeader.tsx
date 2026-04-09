'use client'

import { type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/components/ThemeProvider'
import { Plus, LogOut, Menu, User, ArrowLeft, Home, Moon, Sun } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

interface PageHeaderProps {
  title: string
  subtitle?: string
  titleIcon?: ReactNode
  backHref?: string
  onAddShow?: () => void
  addShowHref?: string
  showMyProfile?: boolean
  showHome?: boolean
  showLogout?: boolean
  onLogout?: () => void
  extraButtons?: ReactNode
  offlineBanner?: boolean
}

export function PageHeader({
  title,
  subtitle,
  titleIcon,
  backHref,
  onAddShow,
  addShowHref,
  showMyProfile = false,
  showHome = false,
  showLogout = false,
  onLogout,
  extraButtons,
  offlineBanner = false,
}: PageHeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleAdd = () => {
    if (onAddShow) {
      onAddShow()
    } else if (addShowHref) {
      router.push(addShowHref)
    }
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      localStorage.removeItem('userName')
      router.push('/')
    }
  }

  const hasAddShow = !!(onAddShow || addShowHref)

  // Collect mobile dropdown items
  const hasMobileDropdown = showMyProfile || showHome || showLogout

  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left side: back arrow + title */}
        <div className={backHref ? 'flex items-center gap-3' : undefined}>
          {backHref && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(backHref)}
              className="p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {titleIcon ? (
                <span className="flex items-center gap-2">
                  {titleIcon}
                  {title}
                </span>
              ) : (
                title
              )}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right side: buttons */}
        <div className="flex gap-2">
          {/* Desktop buttons */}
          <div className="hidden sm:flex gap-2">
            {hasAddShow && (
              <Button onClick={handleAdd} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Show
              </Button>
            )}
            {showMyProfile && (
              <Button
                onClick={() => router.push('/my-profile')}
                variant="outline"
                size="sm"
              >
                <User className="w-4 h-4 mr-1" />
                My Profile
              </Button>
            )}
            {showHome && (
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                size="sm"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>
            )}
            {extraButtons}
            <ThemeToggle />
            {showLogout && (
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="sm:hidden flex gap-2">
            {hasAddShow && (
              <Button onClick={handleAdd} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            )}
            {extraButtons}
            {hasMobileDropdown && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0 touch-manipulation"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-2">
                  {showMyProfile && (
                    <DropdownMenuItem
                      onClick={() => router.push('/my-profile')}
                      className="py-3"
                    >
                      <User className="mr-3 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                  )}
                  {showHome && (
                    <DropdownMenuItem
                      onClick={() => router.push('/')}
                      className="py-3"
                    >
                      <Home className="mr-3 h-4 w-4" />
                      Home
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() =>
                      setTheme(theme === 'light' ? 'dark' : 'light')
                    }
                    className="py-3"
                  >
                    {theme === 'dark' ? (
                      <Sun className="mr-3 h-4 w-4" />
                    ) : (
                      <Moon className="mr-3 h-4 w-4" />
                    )}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </DropdownMenuItem>
                  {showLogout && (
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600 py-3"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!hasMobileDropdown && <ThemeToggle />}
          </div>
        </div>
      </div>
      {offlineBanner && (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800 px-4 py-2">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
            You&apos;re offline. Some features may not be available.
          </p>
        </div>
      )}
    </header>
  )
}
