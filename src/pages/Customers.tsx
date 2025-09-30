import { useState } from 'react';
import { useCustomerData } from '@/hooks/useCustomerData';
import { VirtualTable } from '@/components/VirtualTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, Download, Plus } from 'lucide-react';

const Customers = () => {
  const {
    customers,
    searchQuery,
    setSearchQuery,
    sortField,
    sortOrder,
    handleSort,
    totalCount,
    filteredCount,
  } = useCustomerData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Customers</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} customers
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Dummy Filters */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuItem disabled>Score Range</DropdownMenuItem>
                <DropdownMenuItem disabled>Date Range</DropdownMenuItem>
                <DropdownMenuItem disabled>Added By</DropdownMenuItem>
                <DropdownMenuItem disabled>Status</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort By
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuItem disabled>Most Recent</DropdownMenuItem>
                <DropdownMenuItem disabled>Highest Score</DropdownMenuItem>
                <DropdownMenuItem disabled>Name A-Z</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Table */}
      <main className="container mx-auto px-6 py-6">
        <VirtualTable
          data={customers}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </main>
    </div>
  );
};

export default Customers;
