import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsTimeString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTimeString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const regex = /^([0-9]|[0-1][0-9]|2[0-3]):[0-5][0-9]$/; // Format: HH:MM or H:MM
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Time must be in the format HH:MM or H:MM';
        },
      },
    });
  };
}
