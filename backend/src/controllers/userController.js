export const UserController = {
  //Create User
  async create(req, res) {
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

      // Cria o usuário no MySQL através do Prisma
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password, // Obs: No futuro vamos criptografar isso aqui por segurança!
        },
      });

      // Retorna o usuário criado (sem expor a senha por boas práticas)
      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno ao criar usuário." });
    }
  },
};
