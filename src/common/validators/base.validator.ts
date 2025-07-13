import * as Joi from "joi";
import { BadRequestException } from "@common/types/response.type";

export abstract class BaseValidator<T> {
  protected abstract schema: Joi.ObjectSchema<T>;

  private checkRequiredFields(data: unknown): void {
    if (!data || typeof data !== "object") {
      throw new BadRequestException("요청 본문이 필요합니다.");
    }

    const requiredFields = Object.keys(this.schema.describe().keys).filter(
      (key) => {
        const field = this.schema.describe().keys[key];
        return field.flags?.presence === "required";
      }
    );

    const missingFields = requiredFields.filter((field) => {
      const value = (data as any)[field];
      return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `다음 필드는 필수 입력 항목입니다: ${missingFields.join(", ")}`
      );
    }
  }

  validate(data: unknown): T {
    this.checkRequiredFields(data);

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
