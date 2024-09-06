import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Ip } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Prisma } from '@prisma/client';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@SkipThrottle()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  private readonly logger = new MyLoggerService(EmployeesController.name)

  @Post()
  create(@Body() createEmployeeDto: Prisma.EmployeeCreateInput) {
    return this.employeesService.create(createEmployeeDto);
  }

  // Rate limiting is applied to this route.
  @SkipThrottle({ default: false })
  @Throttle({
    short: {
      ttl: 1000,
      limit: 3
    }
  })
  @Get()
  findAll(@Ip() ip: string, @Query('role') role?: 'admin' | 'editor' | 'viewer') {
    this.logger.log(`Request to fetch all employess\t${ip}`, EmployeesController.name);
    return this.employeesService.findAll(role);
  }

  // Rate limiting is applied to this route.
  @SkipThrottle({ default: false })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
