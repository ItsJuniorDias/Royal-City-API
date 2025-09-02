const express = require("express");
const {
  getAllProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  getProductReviews,
  deleteReview,
  createProductReview,
  createProduct,
  getAdminProducts,
  getProducts,
  createProperty,
  getProperty,
} = require("../controllers/productController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/user_actions/auth");

const router = express.Router();

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 */
router.route("/products").get(getAllProducts);

/**
 * @openapi
 * /api/v1/products/all:
 *   get:
 *     summary: Lista produtos (versão alternativa)
 *     tags: [Products]
 */
router.route("/products/all").get(getProducts);

/**
 * @openapi
 * /api/v1/property/all:
 *   get:
 *     summary: Lista todas as propriedades
 *     tags: [Properties]
 */
router.route("/property/all").get(getProperty);

/**
 * @openapi
 * /api/v1/product/new-property:
 *   post:
 *     summary: Cria uma nova propriedade de produto
 *     tags: [Properties]
 */
router.route("/product/new-property").post(createProperty);

/**
 * @openapi
 * /api/v1/admin/products:
 *   get:
 *     summary: Lista todos os produtos (somente admin)
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 */
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

/**
 * @openapi
 * /api/v1/admin/product/new:
 *   post:
 *     summary: Cria um novo produto (somente admin)
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 */
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

/**
 * @openapi
 * /api/v1/admin/product/{id}:
 *   put:
 *     summary: Atualiza um produto pelo ID (somente admin)
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Deleta um produto pelo ID (somente admin)
 *     tags: [Admin - Products]
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
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

/**
 * @openapi
 * /api/v1/product/{id}:
 *   get:
 *     summary: Retorna detalhes de um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do produto retornados
 *       404:
 *         description: Produto não encontrado
 */
router.route("/product/:id").get(getProductDetails);

/**
 * @openapi
 * /api/v1/review:
 *   put:
 *     summary: Cria ou atualiza uma avaliação de produto
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Avaliação adicionada/atualizada com sucesso
 */
router.route("/review").put(isAuthenticatedUser, createProductReview);

/**
 * @openapi
 * /api/v1/admin/reviews:
 *   get:
 *     summary: Lista todas as avaliações de produtos
 *     tags: [Admin - Reviews]
 *   delete:
 *     summary: Deleta uma avaliação (somente admin)
 *     tags: [Admin - Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router
  .route("/admin/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
