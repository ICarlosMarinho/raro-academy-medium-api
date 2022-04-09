import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@ApiTags('usuarios')
@Controller('usuarios')
@ApiBearerAuth()
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<void> {
    const usuario = await this.usuariosService.findOneByLogin(
      createUsuarioDto.login,
    );

    if (!!usuario) {
      throw new HttpException('user already exists', HttpStatus.CONFLICT);
    }

    await this.usuariosService.create(createUsuarioDto);
  }
}
