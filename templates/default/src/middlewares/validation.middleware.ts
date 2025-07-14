import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/httpException';

export const ValidationMiddleware =
  (type: any, skipMissingProperties = false, whitelist = true, forbidNonWhitelisted = true) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    try {
      await validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted });
      req.body = dto;
      next();
    } catch (errors: ValidationError[] | any) {
      const message = Array.isArray(errors)
        ? errors.map((error: ValidationError) => Object.values(error.constraints || {}).join(', ')).join(', ')
        : String(errors);
      next(new HttpException(400, message));
    }
  };
