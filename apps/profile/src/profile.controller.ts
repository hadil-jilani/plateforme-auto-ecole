import { Controller, Get } from '@nestjs/common';
import { ProfileService, UserData } from './profile.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern('get-personnal-profile')
  FindProfile(id : string ) : Promise<{user : UserData}> {
    return this.profileService.findProfile(id);
  }

  @EventPattern('delete-personnal-profile')
  DeleteproFile( id : string) {
    return this.profileService.DeleteProFile(id); 
  }
  

  @MessagePattern('update-personnal-profile')
  update(data) {
    const {id,updateData} = data
    return this.profileService.UpdateProfile(id, updateData);
  }

  @EventPattern('update-password')
  updatePassword(data){
    const {id,updatePassword} = data
    return this.profileService.UpdatePassword(id,updatePassword); 
  }


}
