
export type UserRole = 'agent' | 'admin';

export type AgentStatus = 'pending' | 'active' | 'banned';
export type SubscriptionStatus = 'active' | 'expired' | 'pending_payment' | 'none';

export interface User {
  id: string; // This will map to Firebase Auth UID on the client
  uid?: string; // Store Firebase Auth UID explicitly for clarity, often same as id
  name: string;
  email: string;
  password?: string; // Only used for initial registration form, NOT stored in Firestore
  phoneNumber?: string;
  role: UserRole;
  status?: AgentStatus; // For agents
  subscriptionStatus?: SubscriptionStatus;
  subscriptionExpiryDate?: string | null; // Store as ISO string or Timestamp
  isApproved?: boolean;
  commissionBalance?: number;
  lastDismissedGlobalMessageId?: string; 
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

export interface DataBundle {
  id: string; // Firestore document ID
  name: string;
  dataAmount: string;
  price: number;
  validityPeriodDays: number;
  isActive: boolean;
  description?: string;
  // Timestamps can be added if needed
}

export type OrderStatus = 'pending_payment' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface Order {
  id: string; // Firestore document ID
  agentId: string; // User UID
  agentName?: string; // Denormalized for display
  bundleId: string; // Reference to DataBundle document ID
  bundleName?: string; // Denormalized
  orderDate: string; // Store as ISO string or Timestamp
  status: OrderStatus;
  pricePaid: number;
  paymentReference?: string;
  // Timestamps can be added
}

export interface AgentCommissionSettings {
  // Typically one document in a 'settings' collection
  dataBundleCommissionRate: number; // For data bundles (percentage)
}

export type CashoutRequestStatus = 'pending' | 'approved' | 'paid' | 'rejected';

export interface CashoutRequest {
  id: string; // Firestore document ID
  agentId: string; // User UID
  agentName?: string; // Denormalized
  amount: number;
  requestedDate: string; // ISO string or Timestamp
  status: CashoutRequestStatus;
  processedDate?: string | null; // ISO string or Timestamp
  transactionReference?: string;
  adminNotes?: string;
  // Timestamps
}

export interface GlobalMessage {
  id: string; // Firestore document ID
  message: string;
  createdAt: string; // ISO string or Timestamp
  isActive: boolean; 
  adminId?: string; // User UID of admin who posted
}

export interface Gig {
  id: string; // Firestore document ID
  name: string;
  description: string;
  price: number;
  commission: number; // Fixed amount for Gigs
  imageUrl?: string; 
  isActive: boolean;
  category?: string; 
  termsAndConditions?: string;
  // Timestamps
}

export type GigOrderStatus = 'pending_payment' | 'pending_requirements' | 'in_progress' | 'completed' | 'cancelled' | 'requires_discussion';

export interface GigOrder {
  id: string; // Firestore document ID
  agentId: string; // User UID
  agentName?: string; // Denormalized
  gigId: string; // Reference to Gig document ID
  gigName?: string; // Denormalized
  orderDate: string; // ISO string or Timestamp
  status: GigOrderStatus;
  pricePaid: number; 
  agentCommissionEarned?: number; 
  clientName?: string; 
  clientContact?: string; 
  requirements?: string; 
  agentNotes?: string; 
  adminNotes?: string; 
  processedDate?: string | null; // ISO string or Timestamp
  paymentReference?: string;
  // Timestamps
}
