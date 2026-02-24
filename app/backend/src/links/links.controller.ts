import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { LinksService } from "./links.service";
import { LinkMetadataRequestDto, LinkMetadataResponseDto } from "../dto";
import { LinkValidationError } from "./errors";
import { APIKeyGuard } from "../common/guards/api-key.guard";
import { CustomThrottlerGuard } from "../common/guards/custom-throttler.guard";

@ApiTags("links")
@Controller("links")
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post("metadata")
  @UseGuards(APIKeyGuard, CustomThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Generate canonical link metadata",
    description:
      "Validates payment link parameters and generates canonical metadata for frontend consumption",
  })
  @ApiBody({ type: LinkMetadataRequestDto })
  @ApiResponse({
    status: 200,
    description: "Metadata generated successfully",
    type: LinkMetadataResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation failed",
  })
  async generateMetadata(
    @Body() request: LinkMetadataRequestDto,
  ): Promise<{ success: boolean; data: LinkMetadataResponseDto }> {
    try {
      const metadata = await this.linksService.generateMetadata(request);
      return {
        success: true,
        data: metadata,
      };
    } catch (error) {
      if (error instanceof LinkValidationError) {
        throw new BadRequestException({
          code: error.code,
          message: error.message,
          field: error.field,
        });
      }
      throw error;
    }
  }
}
