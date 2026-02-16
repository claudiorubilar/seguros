
export interface Brokerage {
  id: string;
  name: string;
}

export interface Agent {
  id: string;
  name: string;
  brokerageId: string;
  managerId?: string;
}

export interface Client {
  id: string; // RUT as ID
  name: string;
}

export interface Insurer {
    id: string;
    name: string;
}

export type InstallmentStatus = 'Pagada' | 'Pendiente' | 'Vencida';

export interface Installment {
  id: string;
  policyNumber: string;
  installmentNumber: number;
  totalInstallments: number;
  dueDate: Date;
  paymentDate?: Date;
  netAmount: number;
  tax: number;
  interest: number;
  totalAmount: number;
  status: InstallmentStatus;
  currency: 'CLP' | 'UF';
}

export type PolicyStatus = 'VIGENTE' | 'CANCELADA' | 'VENCIDA';
export type RenewalStatus = 'Renovada' | 'No Renovada' | 'Pendiente';

export interface Attachment {
    id: string;
    filename: string;
    url: string; // Simulated URL
    uploadedAt: Date;
    fileType: 'pdf' | 'image' | 'doc';
}

export interface PolicyNotification {
    id: string;
    message: string;
    date: Date;
    read: boolean;
}

export interface ActivityLog {
    id: string;
    description: string;
    date: Date;
    user: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  product: string;
  lineOfBusiness: string;
  issueDate: Date;
  startDate: Date;
  endDate: Date;
  policyHolderId: string;
  insuredId: string;
  totalPremium: number;
  status: PolicyStatus;
  currency: 'CLP' | 'UF';
  agentId: string;
  brokerageId: string;
  installments: Installment[];
  insurerId: string;
  renewalDate: Date;
  renewalStatus: RenewalStatus;
  attachments: Attachment[];
  notifications: PolicyNotification[];
  activityLog: ActivityLog[];
}

export type UserRole = 'Admin' | 'Agente' | 'Gerente';
export type UserStatus = 'Activo' | 'Inactivo';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    lastLogin: Date;
}

export type ClaimStatus = 'Abierto' | 'En Proceso' | 'Cerrado' | 'Rechazado';

export interface Claim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  policyHolderId: string;
  notificationDate: Date;
  lineOfBusiness: string;
  claimedAmount: number;
  status: ClaimStatus;
  currency: 'CLP' | 'UF';
}

export type QuoteStatus = 'Borrador' | 'Enviada' | 'Aceptada' | 'Rechazada';

export interface Quote {
    id: string;
    quoteNumber: string;
    clientId: string;
    product: string;
    premium: number;
    status: QuoteStatus;
    currency: 'CLP' | 'UF';
    creationDate: Date;
}

export type ProspectStatus = 'Nuevo' | 'Contactado' | 'Calificado' | 'Ganado' | 'Perdido';

export interface Prospect {
    id: string;
    name: string;
    contact: string;
    email: string;
    phone: string;
    agentId: string;
    status: ProspectStatus;
    pipelineValue: number;
    lastContacted: Date;
    attachments: Attachment[];
    activityLog: ActivityLog[];
}

export type TaskStatus = 'Pendiente' | 'En Progreso' | 'Completada';

export interface Task {
    id: string;
    title: string;
    description: string;
    assignedToId: string;
    createdById?: string;
    dueDate: Date;
    status: TaskStatus;
    policyId?: string; // Link task to a policy
    prospectId?: string; // Link task to a prospect
    isArchived?: boolean;
}

export type CommissionType = 'Venta' | 'Renovación' | 'Override' | 'Referido';

export interface Commission {
    id: string;
    policyId: string;
    policyNumber: string;
    installmentId: string;
    agentId: string; // ID of the person receiving the commission (agent or manager)
    amount: number;
    currency: 'CLP' | 'UF';
    type: CommissionType;
    calculationDate: Date;
    relatedAgentId?: string; // For overrides, the agent who made the sale
}

export interface Incentive {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  metric: 'Prima' | 'Pólizas';
  lineOfBusiness?: string;
}