import type { Request, Response } from 'express';
import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) { }

    @Post("register")
    async signup(@Body() request: RegisterDto) {
        return this.authService.register(request);
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(dto);

        res.cookie("refresh_token", result.refreshToken, {
            httpOnly: true,
            secure: this.configService.getOrThrow<boolean>("auth.cookieSecure"),
            sameSite: this.configService.getOrThrow<"lax" | "strict" | "none">("auth.cookieSameSite"),
            path: '/auth',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return {
            accessToken: result.accessToken,
        }
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies["refresh_token"];

        if (!refreshToken) {
            throw new UnauthorizedException("Refresh token not found.");
        }

        const result = await this.authService.refresh(refreshToken);

        res.cookie("refresh_token", result.refreshToken, {
            httpOnly: true,
            secure: this.configService.getOrThrow<boolean>("auth.cookieSecure"),
            sameSite: this.configService.getOrThrow<"lax" | "strict" | "none">("auth.cookieSameSite"),
            path: '/auth',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return {
            accessToken: result.accessToken,
        }
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies["refresh_token"];
        if (!refreshToken) {
            throw new UnauthorizedException("Refresh token not found.");
        }
        await this.authService.logout(refreshToken);
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: '/auth',
        });
        return {
            message: "Logout successful",
        }
    }

}
