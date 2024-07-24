import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsDateString(property: string,validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const regex = /^\d{4}-\d{2}-\d{2}$/gm; // Format: YYYY-MM-DD
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Date must be in the format YYYY-MM-DD';
        },
      },
    });
  };
}