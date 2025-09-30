import { useEffect, useRef, useState, useCallback } from 'react';
import { Customer } from '@/utils/dataGenerator';
import { SortField, SortOrder } from '@/hooks/useCustomerData';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface VirtualTableProps {
  data: Customer[];
  onSort: (field: SortField) => void;
  sortField: SortField | null;
  sortOrder: SortOrder;
}

const ROW_HEIGHT = 60;
const ROWS_PER_PAGE = 30;
const BUFFER_SIZE = 10;

export const VirtualTable = ({ data, onSort, sortField, sortOrder }: VirtualTableProps) => {
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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-muted border-b">
        <div className="flex items-center min-w-[1200px]">
          <div className="w-16 px-4 py-3 text-sm font-medium text-muted-foreground">
            <input type="checkbox" className="rounded border-input" />
          </div>
          <div
            className="flex-1 min-w-[200px] px-4 py-3 text-sm font-medium flex items-center cursor-pointer hover:bg-muted/80"
            onClick={() => onSort('name')}
          >
            Name
            <SortIcon field="name" />
          </div>
          <div
            className="flex-1 min-w-[200px] px-4 py-3 text-sm font-medium flex items-center cursor-pointer hover:bg-muted/80"
            onClick={() => onSort('email')}
          >
            Email
            <SortIcon field="email" />
          </div>
          <div
            className="w-[180px] px-4 py-3 text-sm font-medium flex items-center cursor-pointer hover:bg-muted/80"
            onClick={() => onSort('phone')}
          >
            Phone
            <SortIcon field="phone" />
          </div>
          <div
            className="w-[100px] px-4 py-3 text-sm font-medium flex items-center cursor-pointer hover:bg-muted/80"
            onClick={() => onSort('score')}
          >
            Score
            <SortIcon field="score" />
          </div>
          <div
            className="w-[140px] px-4 py-3 text-sm font-medium flex items-center cursor-pointer hover:bg-muted/80"
            onClick={() => onSort('lastMessageAt')}
          >
            Last Message
            <SortIcon field="lastMessageAt" />
          </div>
          <div className="w-[140px] px-4 py-3 text-sm font-medium text-muted-foreground">
            Added By
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
            {visibleData.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center min-w-[1200px] border-b hover:bg-muted/30 transition-colors"
                style={{ height: ROW_HEIGHT }}
              >
                <div className="w-16 px-4">
                  <input type="checkbox" className="rounded border-input" />
                </div>
                <div className="flex-1 min-w-[200px] px-4 flex items-center gap-3">
                  <Avatar className="h-8 w-8" style={{ backgroundColor: customer.avatar }}>
                    <AvatarFallback className="text-white text-xs">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm truncate">{customer.name}</span>
                </div>
                <div className="flex-1 min-w-[200px] px-4 text-sm text-muted-foreground truncate">
                  {customer.email}
                </div>
                <div className="w-[180px] px-4 text-sm text-muted-foreground">
                  {customer.phone}
                </div>
                <div className="w-[100px] px-4">
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-secondary text-xs font-medium">
                    {customer.score}
                  </div>
                </div>
                <div className="w-[140px] px-4 text-sm text-muted-foreground">
                  {formatDate(customer.lastMessageAt)}
                </div>
                <div className="w-[140px] px-4 text-sm text-muted-foreground">
                  {customer.addedBy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
