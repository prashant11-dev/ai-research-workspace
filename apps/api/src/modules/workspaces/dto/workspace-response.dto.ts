import { ApiProperty } from '@nestjs/swagger';
import { WorkspaceRole } from 'generated/prisma/enums';

export class WorkspaceResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    slug: string;

    @ApiProperty({
        enum: WorkspaceRole,
    })
    role: WorkspaceRole;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}