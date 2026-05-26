const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

// Schemas de validação
const createSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  description: z.string().min(1, "Descrição obrigatória"),
});

const updateSchema = z.object({
  name: z.string().min(1, "Nome inválido").optional(),
  description: z.string().min(1, "Descrição inválida").optional(),
});

// POST /categories
async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const category = await prisma.category.create({ data });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

// GET /categories
async function listAll(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

// GET /categories/:id
async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { posts: { orderBy: { createdAt: "desc" } } },
    });
    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
}

// PATCH /categories/:id
async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const data = updateSchema.parse(req.body);
    const category = await prisma.category.update({
      where: { id },
      data,
    });
    res.json(category);
  } catch (err) {
    next(err);
  }
}

// DELETE /categories/:id
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, listAll, getById, update, remove };
