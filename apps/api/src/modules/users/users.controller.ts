import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { ApiBearerAuth } from "@nestjs/swagger";

interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        email: string;
    };
}

@Controller("users")
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@CurrentUser() user: AuthenticatedUser) {
        return this.userService.findById(
            user.userId,
        );
    }

}