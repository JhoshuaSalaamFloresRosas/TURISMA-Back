export class CreateUserDto {
    name: string;
    password: string;
    firstName: string;
    phone: string;
    email: string;
    admin?: boolean;
    userPhoto?: string;
  }
