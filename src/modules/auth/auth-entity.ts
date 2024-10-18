import { ApiProperty } from "@nestjs/swagger";
import { User} from "@prisma/client"

export class AuthEntity implements User  {
    @ApiProperty()
    id: number

    @ApiProperty({required: true, description: "Nombre del usuario"})
    name: string;

    @ApiProperty({required: true, description: "Contraseña dek usuario"})
    @ApiProperty()
    password: string;

    @ApiProperty({required: true, description: "Apellido del usuario"})
    @ApiProperty()
    lastName: string;

    @ApiProperty({required: true, description: "Numero telefonico del usuario"})
    @ApiProperty()
    phone: string;

    @ApiProperty({required: true, description: "Correo electronico del usuario"})
    @ApiProperty()
    email: string;

    @ApiProperty()
    admin: boolean;

    @ApiProperty()
    actvie: boolean;

    @ApiProperty({required: true, description: "Url de la foto de perfil del usuario"})
    @ApiProperty()
    userPhoto: string;

    @ApiProperty()
    verificationToken: string;

    @ApiProperty()
    isEmailVerified: boolean;
    
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'Correo electrónico de verificación enviado. Por favor, revisa tu bandeja de entrada.' })
  message: string;
}