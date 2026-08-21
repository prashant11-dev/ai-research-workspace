import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {

    constructor(private readonly prisma: PrismaService) { }

    async register(request: RegisterDto) {

        const existingUser = await this.prisma.user.findUnique({ where: { email: request.email } })

        if (existingUser) {
            throw new ConflictException("Unable to create account with the provided information")
        }

        const hashedPassword = await argon2.hash(request.password)

        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: request.email,
                    passwordHash: hashedPassword,
                    firstName: request.firstName,
                    lastName: request.lastName,

                }
            })

            const workspace = await tx.workspace.create({
                data: {
                    name: `${request.firstName}'s workspace`,
                }
            })

            await tx.workspaceMember.create({
                data: {
                    workspaceId: workspace.id,
                    userId: user.id,
                    role: "OWNER"
                }
            })

            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                workspaceId: workspace.id
            };
        });

    }
}
