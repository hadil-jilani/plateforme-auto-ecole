import { activationDto, ForgotPasswordDto, loginDto, ResetPasswordDto, Role, signupDto, status } from '@app/shared';
import { SchoolModel } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(SchoolModel.name) private School: mongoose.Model<SchoolModel>,
    @Inject('Emails') private Sender: ClientProxy,
    private jwtservice: JwtService, 
    private configservice: ConfigService
  ) { }

  // Signup function
  async signup(data: signupDto) {
    const { name, password, email, adresse, phoneNumber } = data;

    const isEmailExist = await this.School.findOne({ email });

    if (isEmailExist) {
      throw new RpcException({
        message: 'User already exists with this email!',
        statusCode: 400
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

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

    const subject = 'Activate your Account';

    this.Sender.emit('send-activation-email', { name, activationCode, subject, email });
    console.log("email to be sent");

    return { activation_token };
  }

  // Create activation token
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

  // Activate user account
  async Activate_Account(activationData: activationDto) {
    const { activationToken, activationCode } = activationData;
    const newUser: { user: signupDto, activationCode: string } = await this.jwtservice.verify(activationToken,
      { secret: this.configservice.get<string>('ACTIVATION_SECRET') } as JwtVerifyOptions
    ) as { user: signupDto, activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new RpcException({
        message: 'Activation Code invalid!',
        statusCode: 400
      });
    }

    const user = await this.School.create({
      ...newUser.user
    });
    return { user };
  }

  // User login
  async login(data: loginDto): Promise<{
    userRole: string,
    accessToken: string,
    refreshToken: string
  }> {
    const { email, password } = data;
    console.log(data)
    const user = await this.School.findOne({ email });
    if (!user) {
      throw new RpcException({
        message: 'Email or password incorrect! Please try again.',
        statusCode: 400
      });
    }

    const isPasswordTrue = await bcrypt.compare(password, user.password);
    if (!isPasswordTrue) {
      throw new RpcException({
        message: 'Email or password incorrect! Please try again.',
        statusCode: 400
      });
    }
    if (user.status === status.PENDING || user.status === status.RESTRICTED) {
      throw new RpcException({
        message: "You can't access your account at the moment.",
        statusCode: 403
      });
    }

    const accessToken = this.jwtservice.sign(
      {
        id: user._id,
        role: user.role,
        fullName: user.name
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
    const userRole = user.role;
    return { accessToken, refreshToken, userRole };
  }

  // Forgot password
  async Forgotpassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.School.findOne({ email: email });
    if (!user) {
      throw new RpcException({
        message: 'User not found with this email!',
        statusCode: 404
      });
    }
    if (user.status === status.PENDING || user.status === status.RESTRICTED) {
      throw new RpcException({
        message: "You can't change your password at the moment.",
        statusCode: 403
      });
    }

    const forgotPasswordToken = await this.generateForgotPasswordTokenForLink(user);
    const longResetPasswordUrl = this.configservice.get<string>('CLIENT_SIDE_URI') + `?verify=${forgotPasswordToken}`;
    console.log(forgotPasswordToken);

    const name = user.name;
    const url = longResetPasswordUrl;

    const subject = 'Reset your Password';

    this.Sender.emit('forgot-pwd-email', { name, url, subject, email });

    return  forgotPasswordToken;
  }

  // Generate forgot password token
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

  // Reset password
  async Reset_Password(resetPasswordDto: ResetPasswordDto) {
    const forgotPasswordToken = resetPasswordDto['forgotPasswordToken'];
    console.log("token received:\n", forgotPasswordToken);
    const password = resetPasswordDto['password'];
    const tokendecoded = await this.jwtservice.decode(forgotPasswordToken);
    console.log(tokendecoded);

    if (!tokendecoded || tokendecoded.exp * 1000 < Date.now()) {
      throw new RpcException({
        message: 'Invalid or expired token!',
        statusCode: 400
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const Id = tokendecoded.user._id;

    const user = await this.School.findOne({ _id: Id, $or: [{ role: Role.SCHOOL }, { role: Role.SUPERADMIN }] });

    if (!user) {
      throw new RpcException({
        message: 'User not found!',
        statusCode: 404
      });
    }
    user.password = hashedPassword;
    await user.save();
    return { Id };
  }

  // Logout
  async logout(serializedReq) {
    console.log("test");
    console.log("service auth");
    console.log(serializedReq);

    // Perform logout operation
    serializedReq.body['user'] = null;
    serializedReq.headers['accesstoken'] = null;
    serializedReq.headers['refreshtoken'] = null;
    return 'Logged Out successfully';
  }
}
