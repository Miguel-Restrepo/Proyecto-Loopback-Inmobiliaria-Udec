import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBeaterToken from 'parse-bearer-token';
import {JwtService} from '../services';
export class AdministradorStrategy implements AuthenticationStrategy {
  name: string = 'Administrador';
  constructor(
    @service(JwtService)
    public servicioJWT: JwtService) {


  }
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = parseBeaterToken(request);
    if (!token) {
      throw new HttpErrors[401]("No existe un token.")
    }
    let info = this.servicioJWT.VerificarToken(token);
    console.log(info);
    
    if (info) {
      if (info.data.role == 'Administrador') {

        let perfil: UserProfile = Object.assign({
          id: info.data.id,
          nombre_usuario: info.data.nombre_Usuario,
          role: info.data.Role
        });
        return perfil;

      } else {
        throw new HttpErrors[401]("Sin permiso de ejecutar esta acción.")

      }

    } else {

      console.log("El Token enviando no es valido Admin")
      throw new HttpErrors[401]("El Token enviando no es valido Admin.")

    }

  }
}
