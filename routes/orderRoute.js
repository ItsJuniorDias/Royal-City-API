const express = require("express");
const {
  newOrder,
  getSingleOrderDetails,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/user_actions/auth");

const router = express.Router();

/**
 * @openapi
 * /api/v1/order/new:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *               shippingInfo:
 *                 type: object
 *               paymentInfo:
 *                 type: object
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.route("/order/new").post(newOrder);

/**
 * @openapi
 * /api/v1/order/{id}:
 *   get:
 *     summary: Retorna os detalhes de um pedido específico
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do pedido
 *       404:
 *         description: Pedido não encontrado
 */
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrderDetails);

/**
 * @openapi
 * /api/v1/orders/me:
 *   get:
 *     summary: Lista todos os pedidos do usuário autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos do usuário
 */
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

/**
 * @openapi
 * /api/v1/admin/orders:
 *   get:
 *     summary: Lista todos os pedidos (somente admin)
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos os pedidos
 */
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

/**
 * @openapi
 * /api/v1/admin/order/{id}:
 *   put:
 *     summary: Atualiza um pedido pelo ID (somente admin)
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Deleta um pedido pelo ID (somente admin)
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
