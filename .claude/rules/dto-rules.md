---
paths: ["src/**/dto/**/*.ts"]
---
# DTO rules

- Every field MUST have a class-validator decorator (@IsString, @IsEnum, etc.)
- Every field MUST have @ApiProperty or @ApiPropertyOptional
- Optional fields use @IsOptional() AND TypeScript `?` syntax
- String fields should have @MaxLength to prevent abuse
- Use UpdateDto = PartialType(CreateDto) pattern — never duplicate fields
- Include realistic `example` values in @ApiProperty for Swagger docs
