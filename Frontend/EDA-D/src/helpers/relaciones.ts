/*Archivo para almacenar las relaciones entre medicamentos
uso del grafo - manejar lo de recomendaciones si no se encuentra un producto
si no hay stock de un producto específico, el grafo permite al sistema saltar
al nodo más cercano que sea un sustituto válido para ofrecérselo al cliente
*/

export const relaciones = [
  ["Ibuprofeno", "Paracetamol"],
  ["Ibuprofeno", "Aspirina"],
  ["Paracetamol", "Aspirina"]
];