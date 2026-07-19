import { prisma } from "../config/database.js";
import bcrypt from "bcrypt";

export const UserController = {
  //Create User
  async create(req, res) {
    console.log("--> Entrou no UserController.create!");
    console.log("REQ BODY:", req.body);
    try {
      const { name, email, password } = req.body;

      // Validação básica se os campos vieram na requisição
      if (!name || !email || !password) {
        return res.status(400).json({
          error: "Todos os campos (name, email, password) são obrigatórios.",
        });
      }

      // Verifica se o e-mail já está cadastrado no banco
      const userExists = await prisma.users.findUnique({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: "Este e-mail já está em uso." });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      // Cria o usuário no MySQL através do Prisma
      const newUser = await prisma.users.create({
        data: {
          name,
          email,
          password: passwordHash, // Obs: No futuro vamos criptografar isso aqui por segurança!
        },
      });

      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno ao criar usuário." });
    }
  },

  //Listar veiculos por usuario
  async userVehicles(req, res) {
    try {
      const prismaInstance = req.prisma || prisma;
      const { userId } = req.params;

      const vehicles = await prismaInstance.vehicles.findMany({
        where: {
          userId: String(userId),
        },
      });

      return res.status(200).json(vehicles);
    } catch (error) {
      return res.status(500).json({
        error: "Erro interno ao listar veículos por usuário.",
        detalhes: error.message || error,
      });
    }
  },

  //Listar Usuário com seus veículos

  async userWithCars(req, res) {
    try {
      const prismaInstance = req.prisma || prisma;
      const { userId } = req.params;

      const userProfile = await prismaInstance.users.findUnique({
        where: {
          id: String(userId),
        },
        include: {
          vehicles: true, // 🟢 "Prisma, traz os veículos deste usuário para mim também!"
        },
      });

      if (!userProfile) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.status(200).json(userProfile);
    } catch (error) {
      return res.status(500).json({
        error: "Erro interno ao listar usuário com seus veículos.",
        detalhes: error.message || error,
      });
    }
  },

  async login(req, res) {
    try {
      const prismaInstance = req.prisma || prisma;
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
      }

      const user = await prismaInstance.users.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: "E-mail ou senha inválidos." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "E-mail ou senha inválidos." });
      }

      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        message: "Login realizado com sucesso!",
        user: userWithoutPassword
      });

    } catch (error) {
      return res.status(500).json({
        error: "Erro interno ao realizar login.",
        detalhes: error.message || error,
      });
    }
  }
};
