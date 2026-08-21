import { Controller, Get } from "@nestjs/common";
import { UserService } from "./users.service";

@Controller("users")
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @Get("count")
    async getUserCount() {
        return this.userService.count();
    }

}