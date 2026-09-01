import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import type { AuthenticatedUser } from "../auth/types/authenticated-user.type";

@Controller('workspaces')
export class WorkspacesController {
    constructor(
        private readonly workspacesService: WorkspacesService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: CreateWorkspaceDto,
    ) {
        return this.workspacesService.create(
            user.userId,
            dto,
        );
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.workspacesService.findAllForUser(user.userId);
    }
}