import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map, catchError, of, BehaviorSubject } from 'rxjs';
import { UserPayload, UserInput, RolePayload, RoleInput } from '../../Types/user.types';

const GET_USERS = gql`
  query {
    getAllUsers {
      id
      username
      email
      active
      roles {
        id
        name
      }
    }
  }
`;

const GET_ROLES = gql`
  query {
    getAllRoles {
      id
      name
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
      username
      email
      active
      roles {
        id
        name
      }
      message
    }
  }
`;

const CREATE_ROLE = gql`
  mutation CreateRole($input: RoleInput!) {
    createRole(input: $input) {
      id
      name
    }
  }
`;


const DEACTIVATE_USER = gql`
  mutation DeactivateUser($id: ID!) {
    deactivateUser(id: $id) {
      id
      username
      email
      active
      roles {
        id
        name
      }
      message
    }
  }
`;

const REACTIVATE_USER = gql`
  mutation ReactivateUser($id: ID!) {
    reactivateUser(id: $id) {
      id
      username
      email
      active
      roles {
        id
        name
      }
      message
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      id
      username
      email
      active
      roles {
        id
        name
      }
      message
    }
  }
`;
const UPDATE_ROLE = gql`
  mutation UpdateRole($id: ID!, $input: RoleInput!) {
    updateRole(id: $id, input: $input) {
      id
      name
      message
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private rolesSubject = new BehaviorSubject<RolePayload[]>([]);
  roles$ = this.rolesSubject.asObservable();

  private usersSubject = new BehaviorSubject<UserPayload[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private apollo: Apollo) {
    this.loadRoles();
    this.loadUsers();
  }

  private loadRoles() {
    this.getRoles().subscribe({
      next: (roles) => this.rolesSubject.next(roles),
      error: (error) => console.error('Error loading roles:', error)
    });
  }

  private loadUsers() {
    this.getUsers().subscribe({
      next: (users) => this.usersSubject.next(users),
      error: (error) => console.error('Error loading users:', error)
    });
  }

  updateUser(id: string, input: UserInput): Observable<UserPayload> {
    return this.apollo.mutate<{ updateUser: UserPayload }>({
      mutation: UPDATE_USER,
      variables: { id, input },
      refetchQueries: [
        { query: GET_USERS }
      ]
    }).pipe(
      map(result => {
        if (!result.data?.updateUser) {
          throw new Error('No data returned from updateUser mutation');
        }
        this.loadUsers();
        return result.data.updateUser;
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        throw error;
      })
    );
  }
  
  getUsers(): Observable<UserPayload[]> {
    return this.apollo.watchQuery<{ getAllUsers: UserPayload[] }>({
      query: GET_USERS,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => {
        if (!result.data?.getAllUsers) {
          throw new Error('No users data returned');
        }
        return result.data.getAllUsers;
      }),
      catchError(error => {
        console.error('Error fetching users:', error);
        throw error;
      })
    );
  }

  getRoles(): Observable<RolePayload[]> {
    return this.apollo.query<{ getAllRoles: RolePayload[] }>({
      query: GET_ROLES
    }).pipe(
      map(result => {
        if (!result.data?.getAllRoles) {
          throw new Error('No roles data returned');
        }
        return result.data.getAllRoles;
      }),
      catchError(error => {
        console.error('Error fetching roles:', error);
        throw error;
      })
    );
  }

  createUser(input: UserInput): Observable<UserPayload> {
    return this.apollo.mutate<{ createUser: UserPayload }>({
      mutation: CREATE_USER,
      variables: { input },
      refetchQueries: [
        { query: GET_USERS },
        { query: GET_ROLES }
      ]
    }).pipe(
      map(result => {
        if (!result.data?.createUser) {
          throw new Error('No data returned from createUser mutation');
        }
        this.loadUsers(); // Refresh users after creation
        return result.data.createUser;
      }),
      catchError(error => {
        console.error('Error creating user:', error);
        throw error;
      })
    );
  }

  createRole(input: RoleInput): Observable<RolePayload> {
    return this.apollo.mutate<{ createRole: RolePayload }>({
      mutation: CREATE_ROLE,
      variables: { input },
      refetchQueries: [
        { query: GET_ROLES }
      ]
    }).pipe(
      map(result => {
        if (!result.data?.createRole) {
          throw new Error('No data returned from createRole mutation');
        }
        this.loadRoles(); // Refresh roles after creation
        return result.data.createRole;
      }),
      catchError(error => {
        console.error('Error creating role:', error);
        throw error;
      })
    );
  }

  deactivateUser(userId: string): Observable<UserPayload> {
    return this.apollo.mutate<{ deactivateUser: UserPayload }>({
      mutation: DEACTIVATE_USER,
      variables: { id: userId },
      refetchQueries: [
        { query: GET_USERS }
      ]
    }).pipe(
      map(result => {
        if (!result.data?.deactivateUser) {
          throw new Error('No data returned from deactivate user mutation');
        }
        this.loadUsers(); // Refresh users after deactivation
        return result.data.deactivateUser;
      }),
      catchError(error => {
        console.error('Error deactivating user:', error);
        throw error;
      })
    );
  }

  reactivateUser(userId: string): Observable<UserPayload> {
    return this.apollo.mutate<{ reactivateUser: UserPayload }>({
      mutation: REACTIVATE_USER,
      variables: { id: userId },
      refetchQueries: [
        { query: GET_USERS }
      ]
    }).pipe(
      map(result => {
        if (!result.data?.reactivateUser) {
          throw new Error('No data returned from reactivate user mutation');
        }
        this.loadUsers(); // Refresh users after reactivation
        return result.data.reactivateUser;
      }),
      catchError(error => {
        console.error('Error reactivating user:', error);
        throw error;
      })
    );
  }

  updateRole(id: string, input: RoleInput): Observable<RolePayload> {
    return this.apollo.mutate<{ updateRole: RolePayload }>({
      mutation: UPDATE_ROLE,
      variables: { id, input },
      refetchQueries: [
        { query: GET_ROLES }
      ]
    }).pipe(
      map(result => {
        if (!result.data?.updateRole) {
          throw new Error('No data returned from updateRole mutation');
        }
        this.loadRoles();
        return result.data.updateRole;
      }),
      catchError(error => {
        console.error('Error updating role:', error);
        throw error;
      })
    );
  }
} 