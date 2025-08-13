import { IsEmpty, IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "../entities/user.entity";

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    readonly firstName: string;

    @IsOptional()
    @IsString()
    readonly lastName: string;

    @IsOptional()
    @IsString()
    readonly pronoun: string;
    
    @IsOptional()
    @IsEmpty({message: 'Cannot update email here'})
    readonly email: string;

    @IsOptional()
    @IsEmpty({message: 'Cannot update password here'})
    readonly password: string;

    @IsOptional()
    @IsEnum(Role)
    readonly role: Role;

}
