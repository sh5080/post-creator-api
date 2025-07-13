import Joi from "joi";
import { BadRequestException } from "@common/types/response.type";

export abstract class BaseValidator<T> {
  protected abstract schema: Joi.ObjectSchema<T>;

  validate(data: unknown): T {
    const { error, value } = this.schema.validate(data, { abortEarly: false });

    if (error) {
      throw new BadRequestException(
        `입력 유효성 검사 오류: ${error.details
          .map((d) => d.message)
          .join(", ")}`
      );
    }

    return value;
  }
}
