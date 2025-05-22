import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ThemeSwitch } from "@/components/theme-switch"
import { ApiKeyCheck } from "@/components/api-key-check"

export default function Settings() {
  return (
    <>
      <div
        className="fixed inset-0 bg-[url('/circular-library.jpeg')] bg-cover bg-center bg-no-repeat"
        style={{
          zIndex: -1,
        }}
      ></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">Settings</h1>
          <p className="text-white drop-shadow-md mt-2">Manage your preferences and account settings</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="border-primary/20 bg-background/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                </div>
                <ThemeSwitch id="dark-mode" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-background/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Search Preferences</CardTitle>
              <CardDescription>Customize your search experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="save-history">Save Search History</Label>
                  <p className="text-sm text-muted-foreground">Keep a record of your previous searches</p>
                </div>
                <Switch id="save-history" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-cite">Auto-generate Citations</Label>
                  <p className="text-sm text-muted-foreground">Automatically format citations for saved papers</p>
                </div>
                <Switch id="auto-cite" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-background/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Manage your data and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics">Usage Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve the application by sharing anonymous usage data
                  </p>
                </div>
                <Switch id="analytics" defaultChecked />
              </div>

              <Separator />

              <div>
                <Button variant="destructive">Clear All Data</Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This will delete all your saved papers, notes, and search history
                </p>
              </div>
            </CardContent>
          </Card>

          <ApiKeyCheck />
        </div>
      </div>
    </>
  )
}
