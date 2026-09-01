import { Injectable } from "@nestjs/common";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import slugify from 'slugify';
import { PrismaService } from "src/database/prisma.service";
import { WorkspaceResponseDto } from "./dto/workspace-response.dto";

@Injectable()
export class WorkspacesService {

    constructor(private readonly prisma: PrismaService) { }

    async create(
        userId: string,
        dto: CreateWorkspaceDto,
    ) {
        const slug = slugify(dto.name, {
            lower: true,
            strict: true,
        });

        return this.prisma.$transaction(async (tx) => {
            const workspace = await tx.workspace.create({
                data: {
                    name: dto.name.trim(),
                    slug,
                },
            });

            await tx.workspaceMember.create({
                data: {
                    workspaceId: workspace.id,
                    userId,
                    role: 'OWNER',
                },
            });

            return workspace;
        });
    }

    async findAllForUser(userId: string): Promise<WorkspaceResponseDto[]> {
        const memberships = await this.prisma.workspaceMember.findMany({
            where: {
                userId,
            },

            include: {
                workspace: true
            },

            orderBy: {
                createdAt: 'desc'
            }
        })


        return memberships.map(
            ({ workspace, role }) => ({
                id: workspace.id,
                name: workspace.name,
                slug: workspace.slug,
                role,
                createdAt: workspace.createdAt,
                updatedAt: workspace.updatedAt,
            }),
        );
    }
}