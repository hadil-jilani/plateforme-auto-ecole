import { activationDto, ForgotPasswordDto, loginDto, ResetPasswordDto, Role, signupDto, status } from '@app/shared';
import { EcoleModel } from '@app/shared';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as bcrypt from "bcryptjs"

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(EcoleModel.name) private Ecole: mongoose.Model<EcoleModel>,
    @Inject('Emails') private Sender: ClientProxy,
    private jwtservice: JwtService, private configservice: ConfigService
  ) { }


  // lena bch tasna3 activation code w tekhou el data mtaa el user wthothom fl  JWTtoken wtraja3ha ll userinterface (front) 

  async signup(data: signupDto) {
    const { name, password, email, adresse, phoneNumber } = data;


    const isEmailExist = await this.Ecole.findOne({ email });

    if (isEmailExist) {
      throw new RpcException(new BadRequestException(' User already exists with this email  ! '));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)

    const user = {
      name,
      email,
      adresse,
      phoneNumber,
      password: hashedPassword,
    };
    const activationToken = await this.createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const activation_token = activationToken.token;

    /*  const  text  =  ` Hello ${name} 
 
        Thank you for registering with plateforme multicanal pour l'engagement client . To activate your account,
        please use the following activation code:
      
      ${activationCode}
      
        Please enter this code on the activation page within the next 5
        minutes.
      ` */

    const subject = 'Activate your Account'
    activationCode

    this.Sender.emit('send-activation-email',
      { name, activationCode, subject, email });
    console.log("email to be sent")

    return { activation_token };
  }











  // creation du token pour la activation  (lorsque on s'assure que le code de l'utilisateur et la meme que la code envoyée dans le token en fair la creation du user dans la db )
  async createActivationToken(user: signupDto) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtservice.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configservice.get<string>('ACTIVATION_SECRET'),
        expiresIn: '7m',
      },
    );
    return { token, activationCode };
  }





  // lena el fonction hethy bch ysirelha l appel wakt tenzel al button verify code , bch tekhou el token eli baththelk mbekri w tekhou el code eli enty 
  // ktebtou tawa , tkaren el token beli baththelk , w tekhou menha el activation code wl data mtaa el user w tamalou create fl redis
  async Activate_Account(activationData: activationDto) {
    const { activationToken, activationCode } = activationData;
    const newUser: { user: signupDto, activationCode: string } = await this.jwtservice.verify(activationToken,
      { secret: this.configservice.get<string>('ACTIVATION_SECRET') } as JwtVerifyOptions
    ) as { user: signupDto, activationCode: string }

    //activationCode houa el code eli enty ktebtou wl newUser.activationCode houa el code eli m3adihoulk fl token 
    if (newUser.activationCode !== activationCode) {
      throw new RpcException(new BadRequestException(' Activation Code invalid !'));
    }

    const user = await this.Ecole.create({
      ...newUser.user
    })
    return { user }
  }




  async login(data: loginDto): Promise<{
    userRole: string,
    accessToken: string,
    refreshToken: string
  }> {
    const { email, password } = data
    const user = await this.Ecole.findOne({ email });
    if (!user) {
      throw new RpcException(new BadRequestException('Email or password incorrect! Please try again.'));
    }

    const ispasswordtrue = await bcrypt.compare(password, user.password);
    if (!ispasswordtrue) {
      throw new RpcException(new BadRequestException('Email or password incorrect! Please try again.'));
    }
    if (user.status === status.EN_ATTENTE || user.status === status.RESTREINT) {
      throw new RpcException(new BadRequestException("You can't access your account at the moment."));
    }

    const accessToken = this.jwtservice.sign(
      {
        id: user._id,
        role: user.role
      },
      {
        secret: this.configservice.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '30m',
      },
    );

    const refreshToken = this.jwtservice.sign(
      {
        id: user._id,
        role: user.role
      },
      {
        secret: this.configservice.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '1d',
      },
    );
    const userRole = user.role
    return { accessToken, refreshToken, userRole };
  }


  async Forgotpassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.Ecole.findOne({ email: email });
    if (!user) {
      throw new RpcException(new BadRequestException(' User not found with this email !'));
    }
    if (user.status === status.EN_ATTENTE || user.status === status.RESTREINT) {
      throw new RpcException(new BadRequestException("You can't change  your password at the moment."));
    }

    const ForgotpasswordToken = await this.generateForgotPasswordTokenForLink(user);
    const longResetPasswordUrl = this.configservice.get<string>('CLIENT_SIDE_URI') + `?verify=${ForgotpasswordToken}`;
    console.log(ForgotpasswordToken)

    const name = user.name
    const url = longResetPasswordUrl

    const subject = 'Reset your Password'


    this.Sender.emit('forgot-pwd-email',
      { name, url, subject, email });

    return { message: `Your forgot password request is succesful` };
  }


  // generation du link 
  async generateForgotPasswordTokenForLink(user: any) {
    const forgotPasswordToken = this.jwtservice.sign(
      {
        user,
      },
      {
        secret: this.configservice.get<string>('FORGOT_PASSWORD_SECRET'),
        expiresIn: '5m',
      },
    );
    return forgotPasswordToken;
  }

  // Fl view win bch tekteb el mdp ejdid ==> ki tenzel al button modifier mot de pass el function hethy bch tkhdm 
  // w taaml modification ll mdp mtaa el user 



  // lena baed ma enty nzelt al url bch thezek l interface win bch tekteb el mot de passe ejdid 
  // ki tnzl al changer mdp baed ma dakhalt el new password , ken el token valide ybadalek sionon ykolk invalide 
  async Reset_Password(resetPasswordDto: ResetPasswordDto) {

    const forgotPasswordToken = resetPasswordDto['forgotPasswordToken']
    console.log("token received:\n",forgotPasswordToken)
    const password = resetPasswordDto['password']
    const tokendecoded = await this.jwtservice.decode(forgotPasswordToken);
    console.log(tokendecoded)

    if (!tokendecoded || tokendecoded.exp * 1000 < Date.now()) {
      throw new RpcException(new BadRequestException('Invalid or expired token!'));
    }
    /* if (!tokendecoded || tokendecoded.exp * 1000 < Date.now()) {
      throw new RpcException(new BadRequestException('Invalid or expired token!'));
    }
    if (!tokendecoded) {
      throw new RpcException(new BadRequestException('Invalid token!'));
    } */

    const hashedPassword = await bcrypt.hash(password, 10);
    const Id = tokendecoded.user._id;

    const user = await this.Ecole.findOne({ _id: Id, $or: [{ role: Role.ECOLE }, { role: Role.SUPERADMIN }] });

    if (!user) {
      throw new RpcException(new NotFoundException('User not found!'));
    }
    user.password = hashedPassword;
    await user.save();
    return { Id };
  }


  async logout(serializedReq) {
    console.log( "test")
    console.log("service auth");
  console.log(serializedReq);

  // Perform logout operation
  serializedReq.body['user'] = null;
  serializedReq.headers['accesstoken'] = null;
  serializedReq.headers['refreshtoken'] = null;
  return 'Logged Out successfully'
  }
  // async logout(req: Request) {
  //   console.log("service auth")

  //   req.body['user'] = null
  //   req.headers['accesstoken'] = null
  //   req.headers['refreshtoken'] = null
  //   return 'Logged Out successfully'
  // }










}
