export const ESTADOS = {
    EN_REGISTRO: 1,
    EN_REVISION: 2,
    APROBADO: 3,
    RECHAZADO: 4
};

export const ESTADO_NOMBRES = {
    1: { label: 'En Registro', color: 'bg-blue-100 text-blue-800' },
    2: { label: 'En Revisión', color: 'bg-yellow-100 text-yellow-800' },
    3: { label: 'Aprobado', color: 'bg-green-100 text-green-800' },
    4: { label: 'Rechazado', color: 'bg-red-100 text-red-800' }
};

export const ROLES = {
    TECNICO: 'Tecnico',
    COORDINADOR: 'Coordinador',
    ADMINISTRADOR: 'Administrador'
};