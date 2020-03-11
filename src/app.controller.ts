import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { NationalParkDto } from './national-park.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('nationalParks')
  getNationalParks() {
    return this.prisma.nationalPark.findMany({ include: { country: true } });
  }

  @Post('nationalParks')
  async createNationalPark(@Body() nationalParkDto: NationalParkDto) {
    const country = await this.prisma.country.findOne({
      where: { name: nationalParkDto.country },
    });

    if (country) {
      return this.prisma.nationalPark.create({
        data: {
          name: nationalParkDto.name,
          country: { connect: { id: country.id } },
        },
        include: { country: true },
      });
    } else {
      return this.prisma.nationalPark.create({
        data: {
          name: nationalParkDto.name,
          country: { create: { name: nationalParkDto.country } },
        },
        include: { country: true },
      });
    }
  }
}
