"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowUpDown, Mail, Phone, User, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive' | 'blocked';
};

const statusVariantMap: Record<Customer['status'], string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  blocked: 'bg-red-100 text-red-800',
};

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data - replace with actual data fetching
  const customers: Customer[] = [
    {
      id: "CUST-001",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "(555) 123-4567",
      location: "New York, USA",
      orders: 12,
      totalSpent: 1245.99,
      lastOrder: "2023-06-15T10:30:00Z",
      status: 'active'
    },
    {
      id: "CUST-002",
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "(555) 234-5678",
      location: "Los Angeles, USA",
      orders: 5,
      totalSpent: 456.50,
      lastOrder: "2023-06-10T14:22:00Z",
      status: 'active'
    },
    {
      id: "CUST-003",
      name: "James Wilson",
      email: "james.w@example.com",
      phone: "(555) 345-6789",
      location: "Chicago, USA",
      orders: 2,
      totalSpent: 189.75,
      lastOrder: "2023-05-28T09:15:00Z",
      status: 'inactive'
    },
    {
      id: "CUST-004",
      name: "Sarah Miller",
      email: "sarah.m@example.com",
      phone: "(555) 456-7890",
      location: "Houston, USA",
      orders: 8,
      totalSpent: 876.20,
      lastOrder: "2023-06-12T16:45:00Z",
      status: 'active'
    },
  ];

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer accounts and view their activity
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>
                View and manage your store's customers
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.id}`} alt={customer.name} />
                          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.location}</TableCell>
                    <TableCell>{customer.orders} orders</TableCell>
                    <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                    <TableCell>{formatDate(customer.lastOrder)}</TableCell>
                    <TableCell>
                      <Badge className={statusVariantMap[customer.status]}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
