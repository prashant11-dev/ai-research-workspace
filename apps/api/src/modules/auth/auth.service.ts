import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { generateRefreshToken, hashRefreshToken } from './token.util';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }

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

    async login(dto: LoginDto) {
        const user = await this.validateUser(
            dto.email,
            dto.password,
        );

        if (!user) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        });

        const refreshToken = generateRefreshToken();
        const refreshTokenHash =
            hashRefreshToken(refreshToken);

        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
        );

        await this.prisma.refreshToken.create({
            data: {
                tokenHash: refreshTokenHash,
                userId: user.id,
                expiresAt,
            },
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    private async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            return null
        }

        const isPasswordValid = await argon2.verify(user.passwordHash, password)
        if (!isPasswordValid) {
            return null;
        }

        return user;
    }
}
