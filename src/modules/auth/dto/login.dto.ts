import { ApiProperty } from "@nestjs/swagger";

export class LoginDTO {
    @ApiProperty({required: true, description: "Email del usuario"})
    username: string

    @ApiProperty({required: true, description: "Contraseña del usuario"})
    password: string
}