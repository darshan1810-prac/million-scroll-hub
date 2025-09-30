// Generate 1 million customer records
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  score: number;
  lastMessageAt: string;
  addedBy: string;
  avatar: string;
}

const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'James', 'Mary', 'Robert', 'Patricia', 'William', 'Jennifer', 'Richard', 'Linda'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson'];
const addedByUsers = ['Karthikey Mishra', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Tom Wilson'];

// Generate phone number
const generatePhone = (id: number): string => {
  const area = 200 + (id % 800);
  const prefix = 100 + (id % 900);
  const line = 1000 + (id % 9000);
  return `+1 (${area}) ${prefix}-${line}`;
};

// Generate email
const generateEmail = (firstName: string, lastName: string, id: number): string => {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@example.com`;
};

// Generate last message date
const generateLastMessageAt = (id: number): string => {
  const daysAgo = id % 365;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const generateCustomers = (count: number): Customer[] => {
  const customers: Customer[] = [];
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const phone = generatePhone(i);
    const avatarId = (i % 70) + 1;
    
    customers.push({
      id: phone,
      name,
      phone,
      email: generateEmail(firstName, lastName, i),
      score: Math.floor(Math.random() * 100),
      lastMessageAt: generateLastMessageAt(i),
      addedBy: addedByUsers[i % addedByUsers.length],
      avatar: `https://i.pravatar.cc/150?img=${avatarId}`,
    });
  }
  
  return customers;
};

// Initialize 1M records - memoized for performance
let cachedCustomers: Customer[] | null = null;

export const getCustomers = (): Customer[] => {
  if (!cachedCustomers) {
    console.time('Generate 1M customers');
    cachedCustomers = generateCustomers(1000000);
    console.timeEnd('Generate 1M customers');
  }
  return cachedCustomers;
};
