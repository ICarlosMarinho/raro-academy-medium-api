import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SenhaService } from 'src/shared/senha.service';
import { AutenticaUsuarioDto } from 'src/usuarios/dto/autentica-usuario.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuariosService,
    private senhaService: SenhaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, senha: string): Promise<any> {
    const usuario = await this.usuarioService.findOneByLogin(login);
    if (usuario && usuario.senha === this.senhaService.hashSenha(senha)) {
      const { id, nome, ..._ } = usuario;
      return { id, nome };
    }

    return null;
  }

  async login({ login, senha }: AutenticaUsuarioDto) {
    const user = await this.validateUser(login, senha);
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user };
    return {
      access_token: this.jwtService.sign(payload),
      nome: user.nome,
      id: user.id,
    };
  }
}
