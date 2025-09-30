import { useState, useMemo, useCallback, useEffect } from 'react';
import { Customer, getCustomers } from '@/utils/dataGenerator';

export type SortField = 'name' | 'email' | 'phone' | 'score' | 'lastMessageAt';
export type SortOrder = 'asc' | 'desc' | null;

export type FilterType = 'score' | 'dateRange' | 'addedBy' | 'status';

export interface ActiveFilter {
  type: FilterType;
  label: string;
  value?: string;
}

export const useCustomerData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  // Get all customers once
  const allCustomers = useMemo(() => getCustomers(), []);

  // Debounce search with 250ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort data
  const filteredAndSortedCustomers = useMemo(() => {
    let result = allCustomers;

    // Apply search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.toLowerCase().includes(query)
      );
    }

    // Apply active filters
    activeFilters.forEach((filter) => {
      if (filter.type === 'score') {
        const match = filter.value?.match(/(\d+)-(\d+)/);
        if (match) {
          const [, min, max] = match;
          result = result.filter(
            (c) => c.score >= parseInt(min) && c.score <= parseInt(max)
          );
        }
      } else if (filter.type === 'addedBy' && filter.value) {
        result = result.filter((c) => c.addedBy === filter.value);
      }
    });

    // Apply sorting
    if (sortField && sortOrder) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }

    return result;
  }, [allCustomers, debouncedSearch, sortField, sortOrder]);

  const handleSort = useCallback((field: SortField) => {
    setSortField(field);
    setSortOrder((prev) => {
      if (sortField !== field) return 'asc';
      if (prev === 'asc') return 'desc';
      if (prev === 'desc') return null;
      return 'asc';
    });
  }, [sortField]);

  const addFilter = useCallback((filter: ActiveFilter) => {
    setActiveFilters((prev) => {
      const exists = prev.some((f) => f.type === filter.type && f.value === filter.value);
      if (exists) return prev;
      return [...prev, filter];
    });
  }, []);

  const removeFilter = useCallback((filter: ActiveFilter) => {
    setActiveFilters((prev) =>
      prev.filter((f) => !(f.type === filter.type && f.value === filter.value))
    );
  }, []);

  return {
    customers: filteredAndSortedCustomers,
    searchQuery,
    setSearchQuery,
    sortField,
    sortOrder,
    handleSort,
    totalCount: allCustomers.length,
    filteredCount: filteredAndSortedCustomers.length,
    activeFilters,
    addFilter,
    removeFilter,
  };
};
