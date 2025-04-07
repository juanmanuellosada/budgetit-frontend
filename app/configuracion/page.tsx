"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { GeneralSettings } from "@/components/settings/general-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { ExportSettings } from "@/components/settings/export-settings"

export default function SettingsPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("settings")}</h1>
        <p className="text-muted-foreground">{t("manageYourPreferences")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings")}</CardTitle>
          <CardDescription>{t("manageYourPreferences")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="appearance" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="general">{t("general")}</TabsTrigger>
              <TabsTrigger value="appearance">{t("appearance")}</TabsTrigger>
              <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
              <TabsTrigger value="security">{t("security")}</TabsTrigger>
              <TabsTrigger value="export">{t("export")}</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-4">
              <GeneralSettings />
            </TabsContent>
            <TabsContent value="appearance" className="mt-4">
              <AppearanceSettings />
            </TabsContent>
            <TabsContent value="notifications" className="mt-4">
              <NotificationSettings />
            </TabsContent>
            <TabsContent value="security" className="mt-4">
              <SecuritySettings />
            </TabsContent>
            <TabsContent value="export" className="mt-4">
              <ExportSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

