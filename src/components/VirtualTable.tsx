import { useRef, useState, useCallback } from 'react';
import { Customer } from '@/utils/dataGenerator';
import { SortField, SortOrder } from '@/hooks/useCustomerData';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';

interface VirtualTableProps {
  data: Customer[];
  onSort: (field: SortField) => void;
  sortField: SortField | null;
  sortOrder: SortOrder;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}

const ROW_HEIGHT = 60;
const ROWS_PER_PAGE = 30;
const BUFFER_SIZE = 10;

export const VirtualTable = ({ data, onSort, sortField, sortOrder, selectedIds, onSelectionChange }: VirtualTableProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_SIZE);
  const endIndex = Math.min(
    data.length,
    Math.ceil((scrollTop + (containerRef.current?.clientHeight || 600)) / ROW_HEIGHT) + BUFFER_SIZE
  );

  const visibleData = data.slice(startIndex, endIndex);
  const totalHeight = data.length * ROW_HEIGHT;
  const offsetY = startIndex * ROW_HEIGHT;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 text-muted-foreground" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const allVisibleSelected = visibleData.length > 0 && visibleData.every(item => selectedIds.has(item.id));

  const handleSelectAll = () => {
    if (allVisibleSelected) {
      const newSelection = new Set(selectedIds);
      visibleData.forEach(item => newSelection.delete(item.id));
      onSelectionChange(newSelection);
    } else {
      const newSelection = new Set(selectedIds);
      visibleData.forEach(item => newSelection.add(item.id));
      onSelectionChange(newSelection);
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    onSelectionChange(newSelection);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center min-w-[1300px]">
          <div className="w-14 px-4 py-3 flex items-center">
            <Checkbox checked={allVisibleSelected} onCheckedChange={handleSelectAll} />
          </div>
          <div
            className="flex-1 min-w-[250px] px-4 py-3 text-xs font-medium text-muted-foreground flex items-center cursor-pointer hover:bg-muted/50"
            onClick={() => onSort('name')}
          >
            Customer
            <SortIcon field="name" />
          </div>
          <div
            className="w-[100px] px-4 py-3 text-xs font-medium text-muted-foreground flex items-center cursor-pointer hover:bg-muted/50"
            onClick={() => onSort('score')}
          >
            Score
            <SortIcon field="score" />
          </div>
          <div
            className="flex-1 min-w-[220px] px-4 py-3 text-xs font-medium text-muted-foreground flex items-center cursor-pointer hover:bg-muted/50"
            onClick={() => onSort('email')}
          >
            Email
            <SortIcon field="email" />
          </div>
          <div
            className="w-[200px] px-4 py-3 text-xs font-medium text-muted-foreground flex items-center cursor-pointer hover:bg-muted/50"
            onClick={() => onSort('lastMessageAt')}
          >
            Last message sent at
            <SortIcon field="lastMessageAt" />
          </div>
          <div className="w-[150px] px-4 py-3 text-xs font-medium text-muted-foreground">
            Added by
          </div>
        </div>
      </div>

      {/* Scrollable Body */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: '600px' }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleData.map((customer) => {
              const isSelected = selectedIds.has(customer.id);
              return (
                <div
                  key={customer.id}
                  className="flex items-center min-w-[1300px] border-b hover:bg-muted/30 transition-colors"
                  style={{ height: ROW_HEIGHT }}
                >
                  <div className="w-14 px-4">
                    <Checkbox checked={isSelected} onCheckedChange={() => handleSelectRow(customer.id)} />
                  </div>
                  <div className="flex-1 min-w-[250px] px-4 flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                      <AvatarFallback>
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.id}</div>
                    </div>
                  </div>
                  <div className="w-[100px] px-4 text-sm font-medium">
                    {customer.score}
                  </div>
                  <div className="flex-1 min-w-[220px] px-4 text-sm text-muted-foreground truncate">
                    {customer.email}
                  </div>
                  <div className="w-[200px] px-4 text-sm text-muted-foreground">
                    {formatDate(customer.lastMessageAt)}
                  </div>
                  <div className="w-[150px] px-4 text-sm text-muted-foreground flex items-center gap-1">
                    <span className="text-muted-foreground">👤</span>
                    {customer.addedBy}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
