import { prisma } from '../config/database.js';
import crypto from 'crypto';

export const VehicleController = {
  async create(req, res) {
    try {
      const { plate, model, brand, userId, year, batteryCapacity } = req.body;

      if (!plate || !model || !brand || !userId || !year || !batteryCapacity) {
        return res.status(400).json({
          error: "Todos os campos (plate, model, brand, userId, year, batteryCapacity) são obrigatórios.",
        });
      }

      const vehicleExists = await prisma.vehicles.findUnique({
        where: { licensePlate: plate },
      });

      if (vehicleExists) {
        return res.status(400).json({ error: "Esta placa já está cadastrada." });
      }

      const newVehicle = await prisma.vehicles.create({
        data: {
          id: crypto.randomUUID(),
          brand,
          model,
          year: Number(year),
          batteryCapacity: Number(batteryCapacity),
          licensePlate: plate,
          userId: String(userId),
          updatedAt: new Date(),
        },
      });

      return res.status(201).json(newVehicle);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno ao criar veículo.", detalhes: error.message });
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