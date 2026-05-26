const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

// Esquemas de validação com o zod
const createSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  content: z.string().min(1, "Conteúdo obrigatório"),
  author: z.string().min(1, "Autor obrigatório"),
  categoryId: z.coerce.number().int().positive("Categoria obrigatória"),
});

const updateSchema = z.object({
  title: z.string().min(1, "Título inválido").optional(),
  content: z.string().min(1, "Conteúdo inválido").optional(),
  categoryId: z.coerce.number().int().positive("Categoria inválida").optional(),
});

// POST /posts
async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const post = await prisma.post.create({data});
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

// GET /posts?search=&categoryId=
async function listAll(req, res, next) {
  try {
    const { search, categoryId } = req.query;
    const parsedCategoryId = categoryId ? Number(categoryId) : undefined;

    const posts = await prisma.post.findMany({
      where: {
        ...({ categoryId: parsedCategoryId }),
        ...(search && {title: { contains: search, mode: "insensitive" }}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (err) {
    next(err);
  }
}

// GET /posts/:id
async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        comments: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Publicação não encontrada" });
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
}

// PATCH /posts/:id
async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const data = updateSchema.parse(req.body);
    const post = await prisma.post.update({
      where: { id },
      data,
    });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

// DELETE /posts/:id
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Remove comentários primeiro para manter integridade referencial
    await prisma.comment.deleteMany({ where: { postId: id } });
    await prisma.post.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, listAll, getById, update, remove };
