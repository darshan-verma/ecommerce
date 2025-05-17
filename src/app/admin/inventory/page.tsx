import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageSearch, PackagePlus } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product inventory and stock levels
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/admin/inventory/add" className="flex items-center gap-2">
              <PackagePlus className="h-4 w-4" />
              Add Inventory
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inventory Overview</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
              <CardDescription>
                View and manage your product inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 rounded-lg border border-dashed">
                <div className="text-center">
                  <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium">No inventory items</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding a new inventory item.
                  </p>
                  <Button className="mt-4">Add Inventory Item</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
              <CardDescription>
                Products that are running low on inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 rounded-lg border border-dashed">
                <div className="text-center">
                  <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium">No low stock items</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All your products have sufficient stock.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="out-of-stock">
          <Card>
            <CardHeader>
              <CardTitle>Out of Stock Items</CardTitle>
              <CardDescription>
                Products that are currently out of stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 rounded-lg border border-dashed">
                <div className="text-center">
                  <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium">No out of stock items</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All your products are in stock.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
