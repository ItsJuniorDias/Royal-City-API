const express = require("express");
const {
  processPayment,
  paytmResponse,
  getPaymentStatus,
  processPaymentStripe,
} = require("../controllers/paymentController");
const { isAuthenticatedUser } = require("../middlewares/user_actions/auth");

const router = express.Router();

/**
 * @openapi
 * /api/v1/payment/process:
 *   post:
 *     summary: Processa pagamento via Paytm
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               orderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pagamento iniciado
 *       400:
 *         description: Erro ao processar pagamento
 */
router.route("/payment/process").post(processPayment);

/**
 * @openapi
 * /api/v1/stripe:
 *   post:
 *     summary: Processa pagamento via Stripe
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *                 example: BRL
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pagamento processado com sucesso
 *       400:
 *         description: Erro ao processar pagamento
 */
router.route("/stripe").post(processPaymentStripe);

/**
 * @openapi
 * /api/v1/callback:
 *   post:
 *     summary: Callback de resposta do Paytm
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Resposta do Paytm recebida
 */
router.route("/callback").post(paytmResponse);

/**
 * @openapi
 * /api/v1/payment/status/{id}:
 *   get:
 *     summary: Consulta o status de um pagamento
 *     tags: [Payments]
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
 *         description: Status do pagamento retornado
 *       404:
 *         description: Pagamento não encontrado
 */
router.route("/payment/status/:id").get(isAuthenticatedUser, getPaymentStatus);

module.exports = router;
