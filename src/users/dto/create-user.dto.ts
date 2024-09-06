import { IsString, IsEnum, IsEmail, IsNotEmpty } from 'class-validator'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsEnum(["admin", "editor", "viewer"], {
        message: 'Valid role required!'
    })
    role: "admin" | "editor" | "viewer";
}