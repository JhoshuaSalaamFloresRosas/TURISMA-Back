import { ApiProperty } from "@nestjs/swagger";

export class UserLogued {
    @ApiProperty()
    name: string

    @ApiProperty()
    email: string
}

export class LoginResponse {
    @ApiProperty({description: "Usuario autenticado"})
    user: UserLogued

    @ApiProperty()
    access_token: string
}