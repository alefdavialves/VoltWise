import { prisma } from "../config/database.js";

export const VehicleController = {
  async create(req, res) {
    try {
      const { plate, model, brand, userId, year, batteryCapacity } = req.body;

      // Validação ultra segura (garante que nenhuma string veio vazia ou apenas com espaços)
      if (
        !plate?.trim() ||
        !model?.trim() ||
        !brand?.trim() ||
        !userId?.trim() ||
        !year ||
        !batteryCapacity
      ) {
        return res.status(400).json({
          error:
            "Todos os campos (plate, model, brand, userId, year, batteryCapacity) são obrigatórios e não podem estar vazios.",
        });
      }

      console.log("Placa recebida na REQ:", plate);

      const vehicleExists = await prisma.vehicles.findUnique({
        where: { licensePlate: plate },
      });

      console.log("Resultado da busca no banco:", vehicleExists);

      if (vehicleExists) {
        return res
          .status(400)
          .json({ error: "Esta placa já está cadastrada." });
      }

      const newVehicle = await prisma.vehicles.create({
        data: {
          // O id é gerado automaticamente pelo @default(uuid()) no seu schema.prisma!
          brand: brand.trim(),
          model: model.trim(),
          year: Number(year),
          batteryCapacity: Number(batteryCapacity),
          licensePlate: plate.trim(),
          userId: String(userId),
          // O updatedAt também é atualizado de forma automática com o @updatedAt do Prisma!
        },
      });

      return res.status(201).json(newVehicle);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro interno ao criar veículo.",
        detalhes: error.message,
      });
    }
  },

  async listAll(req, res) {
    try {
      const prismaInstance = req.prisma || prisma;
      const vehicles = await prismaInstance.vehicles.findMany();
      return res.status(200).json(vehicles);
    } catch (error) {
      return res.status(500).json({
        error: "Erro interno ao listar veículos.",
        detalhes: error.message || error,
      });
    }
  },

  
};
