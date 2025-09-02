const express = require("express");
const User = require("../models/userModel");

const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  getProfileDetails,
} = require("../controllers/userController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/user_actions/auth");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const multer = require("multer");

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // pasta no Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
  },
});

const parser = multer({ storage: storage });

/**
 * @openapi
 * /api/v1/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.route("/register").post(parser.single("avatar"), registerUser);

/**
 * @openapi
 * /api/v1/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.route("/login").post(loginUser);

/**
 * @openapi
 * /api/v1/logout:
 *   get:
 *     summary: Faz logout do usuário autenticado
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
router.route("/logout").get(logoutUser);

/**
 * @openapi
 * /api/v1/me:
 *   get:
 *     summary: Retorna os detalhes do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detalhes do usuário
 */
router.route("/me").get(isAuthenticatedUser, getUserDetails);

/**
 * @openapi
 * /api/v1/profile:
 *   post:
 *     summary: Retorna detalhes do perfil
 *     tags: [Users]
 */
router.route("/profile").post(getProfileDetails);

/**
 * @openapi
 * /api/v1/password/forgot:
 *   post:
 *     summary: Solicita recuperação de senha
 *     tags: [Users]
 */
router.route("/password/forgot").post(forgotPassword);

/**
 * @openapi
 * /api/v1/password/reset/{token}:
 *   put:
 *     summary: Reseta a senha do usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 */
router.route("/password/reset/:token").put(resetPassword);

/**
 * @openapi
 * /api/v1/password/update:
 *   put:
 *     summary: Atualiza a senha do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

/**
 * @openapi
 * /api/v1/me/update:
 *   put:
 *     summary: Atualiza perfil do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

/**
 * @openapi
 * /api/v1/admin/users:
 *   get:
 *     summary: Lista todos os usuários (somente admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

/**
 * @openapi
 * /api/v1/admin/user/{id}:
 *   get:
 *     summary: Retorna detalhes de um usuário (admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Atualiza função de um usuário (admin)
 *     tags: [Admin]
 *   delete:
 *     summary: Deleta um usuário (admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
