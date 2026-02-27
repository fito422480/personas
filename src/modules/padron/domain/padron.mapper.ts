export class PadronMapper {
  static toResponse(data: any) {
    const nombres = data.nombre ?? null;
    const apellidos = data.apellido ?? null;

    return {
      nombre: nombres,
      apellido: apellidos,
      nombresYApellido: data.nombresYApellido,
      cedula: data.cedula,
      fec_nac: data.fec_nac,
      sexo: data.sexo,
      departamento_nombre: data.departamento_nombre,
      distrito_nombre: data.distrito_nombre,
      zona_nombre: data.zona_nombre,
    };
  }
}
