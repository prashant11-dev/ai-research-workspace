import { WorkspaceRole } from 'generated/prisma/enums';

export interface WorkspaceMembershipContext {
    id: string;
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
}