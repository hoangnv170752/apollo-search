"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"

interface ThemeSwitchProps {
  id?: string
}

export function ThemeSwitch({ id = "theme-switch" }: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Switch id={id} disabled />
  }

  return (
    <Switch id={id} checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
  )
}
