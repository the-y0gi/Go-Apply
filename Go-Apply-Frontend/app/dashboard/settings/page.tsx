"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Globe, 
  Palette,
  Key,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  Save,
  Trash2,
  Download,
  AlertTriangle
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export default function SettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  
  // Settings state
  const [settings, setSettings] = useState({
    // General
    language: "en",
    timezone: "America/Toronto",
    dateFormat: "MM/DD/YYYY",
    theme: "system",
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    applicationUpdates: true,
    deadlineReminders: true,
    marketingEmails: false,
    weeklyDigest: true,
    
    // Privacy
    profileVisibility: "private",
    showEmail: false,
    showPhone: false,
    dataCollection: true,
    analyticsOptIn: false,
    
    // Security
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
    
    // Application Preferences
    autoSave: true,
    defaultCurrency: "USD",
    reminderAdvance: "7",
    backupFrequency: "weekly"
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = () => {
    // In real app, this would save to backend
    console.log("Saving settings:", settings)
  }

  const handleExportData = () => {
    // In real app, this would trigger data export
    console.log("Exporting user data...")
  }

  const handleDeleteAccount = () => {
    // In real app, this would show confirmation dialog and delete account
    console.log("Delete account requested...")
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <DashboardSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
                  </div>
                  <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </motion.div>

              {/* Settings Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="w-5 h-5" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>Configure your account preferences and security settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="privacy">Privacy</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="data">Data</TabsTrigger>
                      </TabsList>

                      {/* General Settings */}
                      <TabsContent value="general" className="space-y-6 mt-6">
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="language">Language</Label>
                              <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                                <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="fr">Français</SelectItem>
                                  <SelectItem value="es">Español</SelectItem>
                                  <SelectItem value="zh">中文</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="timezone">Timezone</Label>
                              <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                                <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="America/Toronto">Eastern Time (Toronto)</SelectItem>
                                  <SelectItem value="America/Vancouver">Pacific Time (Vancouver)</SelectItem>
                                  <SelectItem value="America/New_York">Eastern Time (New York)</SelectItem>
                                  <SelectItem value="Europe/London">GMT (London)</SelectItem>
                                  <SelectItem value="Asia/Tokyo">JST (Tokyo)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dateFormat">Date Format</Label>
                              <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange("dateFormat", value)}>
                                <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="theme">Theme</Label>
                              <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                                <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="light">
                                    <div className="flex items-center gap-2">
                                      <Sun className="w-4 h-4" />
                                      Light
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="dark">
                                    <div className="flex items-center gap-2">
                                      <Moon className="w-4 h-4" />
                                      Dark
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="system">
                                    <div className="flex items-center gap-2">
                                      <Monitor className="w-4 h-4" />
                                      System
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Application Preferences</h3>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Auto-save documents</Label>
                                <p className="text-sm text-muted-foreground">Automatically save your work as you type</p>
                              </div>
                              <Switch
                                checked={settings.autoSave}
                                onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="defaultCurrency">Default Currency</Label>
                                <Select value={settings.defaultCurrency} onValueChange={(value) => handleSettingChange("defaultCurrency", value)}>
                                  <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                    <SelectItem value="CAD">CAD ($)</SelectItem>
                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                    <SelectItem value="GBP">GBP (£)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="reminderAdvance">Reminder Advance (days)</Label>
                                <Select value={settings.reminderAdvance} onValueChange={(value) => handleSettingChange("reminderAdvance", value)}>
                                  <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1 day</SelectItem>
                                    <SelectItem value="3">3 days</SelectItem>
                                    <SelectItem value="7">7 days</SelectItem>
                                    <SelectItem value="14">14 days</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Notification Settings */}
                      <TabsContent value="notifications" className="space-y-6 mt-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                              <Bell className="w-5 h-5" />
                              Notification Preferences
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label>Email notifications</Label>
                                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                </div>
                                <Switch
                                  checked={settings.emailNotifications}
                                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label>Push notifications</Label>
                                  <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                                </div>
                                <Switch
                                  checked={settings.pushNotifications}
                                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label>SMS notifications</Label>
                                  <p className="text-sm text-muted-foreground">Receive important updates via SMS</p>
                                </div>
                                <Switch
                                  checked={settings.smsNotifications}
                                  onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                                />
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium text-foreground mb-4">Notification Types</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label>Application updates</Label>
                                  <p className="text-sm text-muted-foreground">Status changes and responses from universities</p>
                                </div>
                                <Switch
                                  checked={settings.applicationUpdates}
                                  onCheckedChange={(checked) => handleSettingChange("applicationUpdates", checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label>Deadline reminders</Label>
                                  <p className="text-sm text-muted-foreground">Reminders for upcoming deadlines</p>
                                </div>
                                <Switch
                                  checked={settings.deadlineReminders}
                                  onCheckedChange={(checked) => handleSettingChange("deadlineReminders", checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label>Marketing emails</Label>
                                  <p className="text-sm text-muted-foreground">Tips, guides, and promotional content</p>
                                </div>
                                <Switch
                                  checked={settings.marketingEmails}
                                  onCheckedChange={(checked) => handleSettingChange("marketingEmails", checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label>Weekly digest</Label>
                                  <p className="text-sm text-muted-foreground">Weekly summary of your application progress</p>
                                </div>
                                <Switch
                                  checked={settings.weeklyDigest}
                                  onCheckedChange={(checked) => handleSettingChange("weeklyDigest", checked)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Privacy Settings */}
                      <TabsContent value="privacy" className="space-y-6 mt-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                              <Shield className="w-5 h-5" />
                              Privacy Controls
                            </h3>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                                <Select value={settings.profileVisibility} onValueChange={(value) => handleSettingChange("profileVisibility", value)}>
                                  <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                    <SelectItem value="mentors-only">Mentors Only</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label>Show email address</Label>
                                  <p className="text-sm text-muted-foreground">Display your email on your public profile</p>
                                </div>
                                <Switch
                                  checked={settings.showEmail}
                                  onCheckedChange={(checked) => handleSettingChange("showEmail", checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label>Show phone number</Label>
                                  <p className="text-sm text-muted-foreground">Display your phone number on your profile</p>
                                </div>
                                <Switch
                                  checked={settings.showPhone}
                                  onCheckedChange={(checked) => handleSettingChange("showPhone", checked)}
                                />
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium text-foreground mb-4">Data Usage</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label>Allow data collection for improvement</Label>
                                  <p className="text-sm text-muted-foreground">Help us improve GoApply by sharing usage data</p>
                                </div>
                                <Switch
                                  checked={settings.dataCollection}
                                  onCheckedChange={(checked) => handleSettingChange("dataCollection", checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label>Analytics opt-in</Label>
                                  <p className="text-sm text-muted-foreground">Allow anonymous analytics tracking</p>
                                </div>
                                <Switch
                                  checked={settings.analyticsOptIn}
                                  onCheckedChange={(checked) => handleSettingChange("analyticsOptIn", checked)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Security Settings */}
                      <TabsContent value="security" className="space-y-6 mt-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                              <Key className="w-5 h-5" />
                              Security Settings
                            </h3>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label>Two-factor authentication</Label>
                                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={settings.twoFactorAuth}
                                    onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                                  />
                                  {!settings.twoFactorAuth && (
                                    <Button size="sm" variant="outline" className="bg-background/50 backdrop-blur border-border/50">
                                      Setup
                                    </Button>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label>Login alerts</Label>
                                  <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                                </div>
                                <Switch
                                  checked={settings.loginAlerts}
                                  onCheckedChange={(checked) => handleSettingChange("loginAlerts", checked)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="sessionTimeout">Session timeout (minutes)</Label>
                                <Select value={settings.sessionTimeout} onValueChange={(value) => handleSettingChange("sessionTimeout", value)}>
                                  <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="15">15 minutes</SelectItem>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                    <SelectItem value="60">1 hour</SelectItem>
                                    <SelectItem value="240">4 hours</SelectItem>
                                    <SelectItem value="never">Never</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium text-foreground mb-4">Password & Authentication</h4>
                            <div className="space-y-4">
                              <Button variant="outline" className="bg-background/50 backdrop-blur border-border/50">
                                Change Password
                              </Button>
                              <Button variant="outline" className="bg-background/50 backdrop-blur border-border/50">
                                View Active Sessions
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Data Management */}
                      <TabsContent value="data" className="space-y-6 mt-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Data Management</h3>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="backupFrequency">Backup frequency</Label>
                                <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange("backupFrequency", value)}>
                                  <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="never">Never</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-sm text-muted-foreground">How often to backup your data</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button onClick={handleExportData} variant="outline" className="bg-background/50 backdrop-blur border-border/50">
                                  <Download className="w-4 h-4 mr-2" />
                                  Export My Data
                                </Button>
                                <Button variant="outline" className="bg-background/50 backdrop-blur border-border/50">
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Backup
                                </Button>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-destructive">
                              <AlertTriangle className="w-5 h-5" />
                              <h4 className="font-medium">Danger Zone</h4>
                            </div>
                            
                            <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                              <div className="space-y-4">
                                <div>
                                  <h5 className="font-medium text-foreground">Delete Account</h5>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Permanently delete your account and all associated data. This action cannot be undone.
                                  </p>
                                </div>
                                <Button 
                                  onClick={handleDeleteAccount}
                                  variant="destructive" 
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Account
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}