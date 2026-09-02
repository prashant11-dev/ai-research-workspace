import { Request } from 'express';
import { WorkspaceMembershipContext } from './workspace-membership-context.type';

export interface WorkspaceRequest
    extends Request {
    user: {
        userId: string;
        email: string;
    };

    workspaceMembership: WorkspaceMembershipContext;
}