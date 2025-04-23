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
        <div className="flex min-h-screen bg-muted/40">
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

                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-1">Recent Product Activities</h1>
                            <p className="text-muted-foreground">List of recent updates or actions made on products</p>
                        </div>
                    </div>

                    {/* Show Loading Spinner */}
                    {isLoading && (
                        <div className="flex justify-center items-center">
                            <div className="animate-pulse">Loading recent activities...</div>
                        </div>
                    )}

                    {/* Show Error */}
                    {isError && (
                        <div className="flex justify-center items-center text-red-500">
                            <p>Error fetching recent activities</p>
                        </div>
                    )}

                    {/* Show Data */}
                    {!isLoading && !isError && recentActivities?.length > 0 && (
                        <div className="grid gap-6 mb-8">
                            {recentActivities.map((activity) => (
                                <Card key={activity.id}>
                                    <CardHeader>
                                        <CardTitle>{activity.name}</CardTitle>
                                        <CardDescription>Last updated: {new Date(activity.last_updated).toLocaleString()}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm">
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
                            <p>No recent activities available</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default RecentActivities;
