import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class WorkspaceAccessGuard implements CanActivate {

    constructor(private readonly prisma: PrismaService) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const userId = request.user?.userId;
        const workspaceId = request?.params?.workspaceId;

        if (!userId || !workspaceId) {
            throw new ForbiddenException(
                'Workspace access denied',
            );
        }

        const membership = await this.prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId,
                    workspaceId
                }
            }
        })

        if (!membership) {
            throw new ForbiddenException(
                'Workspace access denied',
            );
        }

        request.workspaceMembership = membership;
        return true

    }



}