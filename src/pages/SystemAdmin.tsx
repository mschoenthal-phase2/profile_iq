import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Settings, Users, BarChart3 } from "lucide-react";
import { HospitalPermissionManager } from "@/components/admin/HospitalPermissionManager";
import {
  Hospital,
  AdminDashboardStats,
  HospitalPermissionSettings,
} from "@/types/admin";
import { supabaseService } from "@/services/supabase-service";

export default function SystemAdmin() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [permissions, setPermissions] = useState<HospitalPermissionSettings[]>(
    [],
  );
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      // Load hospitals and their permissions
      const [hospitalsResult, permissionsResult, statsResult] =
        await Promise.all([
          supabaseService.getHospitals(),
          supabaseService.getAllHospitalPermissions(),
          supabaseService.getAdminStats(),
        ]);

      if (hospitalsResult.success) {
        setHospitals(hospitalsResult.data || []);
      }

      if (permissionsResult.success) {
        setPermissions(permissionsResult.data || []);
      }

      if (statsResult.success) {
        setStats(
          statsResult.data || {
            total_hospitals: 0,
            total_users: 0,
            active_hospitals: 0,
            sections_configured: 0,
          },
        );
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionUpdate = async (
    hospitalId: string,
    sectionId: string,
    updates: any,
  ) => {
    try {
      const result = await supabaseService.updateHospitalPermission(
        hospitalId,
        sectionId,
        updates,
      );
      if (result.success) {
        // Reload permissions
        const permissionsResult =
          await supabaseService.getAllHospitalPermissions();
        if (permissionsResult.success) {
          setPermissions(permissionsResult.data || []);
        }
      }
    } catch (error) {
      console.error("Error updating permission:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-phase2-blue mx-auto mb-4"></div>
          <p className="text-phase2-dark-gray">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="text-phase2-dark-gray hover:text-phase2-blue"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold text-phase2-dark-gray">
                  System Administration
                </h1>
                <p className="text-sm text-phase2-dark-gray/60">
                  Manage hospital permissions and settings
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              Admin Access
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="hospitals"
              className="flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Hospitals</span>
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-phase2-blue" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Hospitals
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats?.total_hospitals || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats?.total_users || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Settings className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Active Hospitals
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats?.active_hospitals || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Configured Sections
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats?.sections_configured || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Monitor and manage the ProfileIQ system configuration across
                  all hospitals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">
                      Hospital Management
                    </h3>
                    <p className="text-sm text-blue-700">
                      Configure which profile sections are visible and required
                      for each hospital system.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">
                      Permission Control
                    </h3>
                    <p className="text-sm text-green-700">
                      Fine-tune access controls to ensure providers see only
                      relevant profile sections.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hospitals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Management</CardTitle>
                <CardDescription>
                  Manage hospital registrations and basic information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hospitals.map((hospital) => (
                    <div key={hospital.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {hospital.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Code: {hospital.code}
                          </p>
                          {hospital.address && (
                            <p className="text-sm text-gray-500">
                              {hospital.address}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={hospital.is_active ? "default" : "secondary"}
                        >
                          {hospital.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {hospitals.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No hospitals configured yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <HospitalPermissionManager
              hospitals={hospitals}
              permissions={permissions}
              onPermissionUpdate={handlePermissionUpdate}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage system users across all hospitals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  User management functionality coming soon.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
