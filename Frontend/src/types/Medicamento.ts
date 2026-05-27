export interface Medicamento {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  stock: number;
  categoria: string[] | string;
  descripcion?: string;
  updatedAt?: any;
}