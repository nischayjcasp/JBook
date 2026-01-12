import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { MergerService } from "./merger.service";
import { CompareDataDto } from "./entities/compareData.dto";

@Controller("merger")
export class MergerController {
  constructor(private readonly mergerService: MergerService) {}

  @Post("compare")
  mergerCompareCntr(@Body() compareDataDto: CompareDataDto) {
    return this.mergerService.mergerCompareData(compareDataDto);
  }
}
