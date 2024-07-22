import { Controller, Get } from '@nestjs/common';
import { ProfileService, UserData } from './profile.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern('get-profile')
  FindProfile(id : string ) : Promise<{user : UserData}> {
    return this.profileService.findProfile(id);
  }

  @MessagePattern('delete-profile')
  DeleteproFile( id : string) : Promise<string>{
    return this.profileService.DeleteProFile(id); 
  }
  

  @MessagePattern('update-profile')
  update(data): Promise<string> {
    const {id,updateData} = data
    return this.profileService.UpdateProfile(id, updateData);
  }

  @MessagePattern('update-password')
  updatePassword(data){
    const {id,updatePassword} = data
    return this.profileService.UpdatePassword(id,updatePassword); 
  }


}
