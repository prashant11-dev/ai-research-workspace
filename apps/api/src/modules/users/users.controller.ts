import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

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

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Req() request: AuthenticatedRequest) {
        return this.userService.findById(
            request.user.userId,
        );
    }

}