export interface AuditLogs {
  id: number;
  action: string;
  username: string;
  entityType?: string;
  entityId?: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}
