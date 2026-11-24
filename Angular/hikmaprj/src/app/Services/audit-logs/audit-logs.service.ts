import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditLogs } from '../../Types/audit-log.types';

const GET_AUDIT_LOGS = gql`
  query GetAuditLogs {
    getAuditLogs {
      id
      action
      username
      entityType
      entityId
      oldValue
      newValue
      timestamp
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  constructor(private apollo: Apollo) {}

  getAuditLogs(): Observable<AuditLogs[]> {
    return this.apollo
      .watchQuery<{ getAuditLogs: AuditLogs[] }>({
        query: GET_AUDIT_LOGS,
      })
      .valueChanges.pipe(map(result => result.data.getAuditLogs));
  }
}
