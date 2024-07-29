import { PartialType } from "@nestjs/mapped-types";
import { signupDto } from "./signup.dto";

export class UpdatePersonnalProfileDto extends PartialType(signupDto) {}
