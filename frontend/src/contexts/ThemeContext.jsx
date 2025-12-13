import React, { useEffect, useState, createContext, useContext } from 'react'

// * Converted from TS -> JS: removed TypeScript types and fixed broken syntax

// Create context without TS generic
const ThemeContext = createContext(undefined) // * previously: createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }) => {
  // * initialize theme safely (handles missing localStorage / window)
  const [theme, setTheme] = useState(() => {
    try {
      // read saved theme if available
      const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
      if (savedTheme) return savedTheme

      // fallback to prefers-color-scheme if available
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    } catch (e) {
      // if any error (e.g., localStorage blocked), default to light
      return 'light'
    }
  })


  useEffect(() => {
    // Update the HTML element class when theme changes
    try {
      const root = typeof window !== 'undefined' ? window.document.documentElement : null
      if (root) {
        if (theme === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme)
      }
    } catch (e) {
      // fail silently
      // * localStorage may be unavailable in some environments
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// * fixed hook signature and runtime check
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
