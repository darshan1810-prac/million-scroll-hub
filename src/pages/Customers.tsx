import { useState } from 'react';
import { useCustomerData, ActiveFilter } from '@/hooks/useCustomerData';
import { VirtualTable } from '@/components/VirtualTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, Download, Plus, X, CheckCheck } from 'lucide-react';

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
    activeFilters,
    addFilter,
    removeFilter,
  } = useCustomerData();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleFilterSelect = (filter: ActiveFilter) => {
    addFilter(filter);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCheck className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">All Customers</h1>
                <p className="text-xs text-muted-foreground">
                  {filteredCount.toLocaleString()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-foreground"></div>
                <div className="w-1 h-1 rounded-full bg-foreground ml-1"></div>
                <div className="w-1 h-1 rounded-full bg-foreground ml-1"></div>
              </div>
            </Button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Customers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Add Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Score Range</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterSelect({
                      type: 'score',
                      label: 'Score 0-25',
                      value: '0-25',
                    })
                  }
                >
                  0-25
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterSelect({
                      type: 'score',
                      label: 'Score 26-50',
                      value: '26-50',
                    })
                  }
                >
                  26-50
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterSelect({
                      type: 'score',
                      label: 'Score 51-75',
                      value: '51-75',
                    })
                  }
                >
                  51-75
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterSelect({
                      type: 'score',
                      label: 'Score 76-100',
                      value: '76-100',
                    })
                  }
                >
                  76-100
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Added By</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterSelect({
                      type: 'addedBy',
                      label: 'Karthikey Mishra',
                      value: 'Karthikey Mishra',
                    })
                  }
                >
                  Karthikey Mishra
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterSelect({
                      type: 'addedBy',
                      label: 'Sarah Johnson',
                      value: 'Sarah Johnson',
                    })
                  }
                >
                  Sarah Johnson
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleFilterSelect({
                      type: 'addedBy',
                      label: 'Mike Chen',
                      value: 'Mike Chen',
                    })
                  }
                >
                  Mike Chen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Active Filters */}
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {filter.label}
                <button
                  onClick={() => removeFilter(filter)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
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
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </main>
    </div>
  );
};

export default Customers;
