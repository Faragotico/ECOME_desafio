const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

// Schemas de validação
const createSchema = z.object({
  text: z.string().min(1, "Texto do comentário obrigatório"),
});

const updateSchema = z.object({
  text: z.string().min(1, "Texto do comentário obrigatório"),
});

// POST /posts/:id/comments
async function create(req, res, next) {
  try {
    const { text } = createSchema.parse(req.body);
    const postId = Number(req.params.id);
    if (Number.isNaN(postId)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Verifica se o post existe
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: "Publicação não encontrada" });
    }

    const comment = await prisma.comment.create({
      data: { text, postId },
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

// GET /comments/:id
async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }
    res.json(comment);
  } catch (err) {
    next(err);
  }
}

// PATCH /comments/:id
async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const { text } = updateSchema.parse(req.body);
    const comment = await prisma.comment.update({
      where: { id },
      data: { text },
    });
    res.json(comment);
  } catch (err) {
    next(err);
  }
}

// DELETE /comments/:id
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    await prisma.comment.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getById, update, remove };
