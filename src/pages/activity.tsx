import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

const RecentActivities = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { data: recentActivities, isLoading, isError } = useQuery({
        queryKey: ['recent-activities'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('last_updated', { ascending: false }) // Use `last_updated` instead of `updated_at`
                .limit(10); // Limit to 10 most recent activities

            if (error) {
                console.error("Error fetching recent activities:", error);
                throw error;
            }

            return data;
        }
    });

    const { isOpen, toggle, close, collapsed, toggleCollapse } = useSidebar();

    return (
        <div className="flex min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
            <Sidebar
                isOpen={isOpen}
                onClose={close}
                collapsed={collapsed}
                onToggleCollapse={toggleCollapse}
            />

            <div className={cn(
                "flex flex-1 flex-col transition-all duration-300 ease-in-out",
                collapsed ? "md:ml-16" : "md:ml-64"
            )}>
                <Navbar
                    toggleSidebar={toggle}
                    isSidebarCollapsed={collapsed}
                />

                <main className="flex-1 p-6 md:p-8 lg:p-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div>
                            <h1 className="text-4xl font-semibold text-gray-800 tracking-tight mb-2">Recent Product Activities</h1>
                            <p className="text-sm text-gray-600">List of recent updates or actions made on products</p>
                        </div>
                    </div>

                    {/* Show Loading Spinner */}
                    {isLoading && (
                        <div className="flex justify-center items-center">
                            <div className="animate-pulse text-lg text-gray-600">Loading recent activities...</div>
                        </div>
                    )}

                    {/* Show Error */}
                    {isError && (
                        <div className="flex justify-center items-center text-red-500 font-semibold">
                            <p>Error fetching recent activities</p>
                        </div>
                    )}

                    {/* Show Data */}
                    {!isLoading && !isError && recentActivities?.length > 0 && (
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
                            {recentActivities.map((activity) => (
                                <Card key={activity.id} className="border border-gray-200 shadow-lg rounded-lg hover:shadow-xl transition-all">
                                    <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
                                        <CardTitle className="text-xl font-medium text-gray-800">{activity.name}</CardTitle>
                                        <CardDescription className="text-sm text-gray-500">
                                            Last updated: {new Date(activity.last_updated).toLocaleString()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="text-sm text-gray-700">
                                            <p><strong>Price:</strong> {activity.price ? `$${activity.price}` : 'N/A'}</p>
                                            <p><strong>Availability:</strong> {activity.category_type}</p> {/* Assuming this field replaces status */}
                                            <p><strong>Stock Quantity:</strong> {activity.retail_price}</p> {/* Replace with the actual stock field */}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* No Activities Available */}
                    {!isLoading && !isError && recentActivities?.length === 0 && (
                        <div className="flex justify-center items-center text-muted-foreground">
                            <p className="text-lg font-semibold text-gray-500">No recent activities available</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default RecentActivities;
