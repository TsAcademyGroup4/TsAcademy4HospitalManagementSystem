import express from "express";
import { createUser, getUsers, deactivateUser, createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user account (Admin only)
 *     tags:
 *       - Admin Management
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - role
 *               - department
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane.smith@hospital.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *               role:
 *                 type: string
 *                 enum: [DOCTOR, NURSE, PHARMACY, ADMIN, PATIENT]
 *               department:
 *                 type: string
 *                 example: Cardiology
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input or user already exists
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get paginated users list
 *     description: Retrieve all users with pagination (Admin only)
 *     tags:
 *       - Admin Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of users per page (default 10)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by user role
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         page:
 *                           type: number
 *                         limit:
 *                           type: number
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/users",
    authMiddleware,
    authorizeRoles("ADMIN"),
    createUser
);

router.get(
    "/users",
    authMiddleware,
    authorizeRoles("ADMIN"),
    getUsers
);

/**
 * @swagger
 * /api/v1/admin/users/{userId}:
 *   delete:
 *     summary: Deactivate a user
 *     description: Deactivate or remove a user account (Admin only)
 *     tags:
 *       - Admin Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to deactivate
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
    "/users/:userId",
    authMiddleware,
    authorizeRoles("ADMIN"),
    deactivateUser
);

/**
 * @swagger
 * /api/v1/admin/departments:
 *   post:
 *     summary: Create a new department
 *     description: Create a new department (Admin only)
 *     tags:
 *       - Admin Management
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cardiology
 *               description:
 *                 type: string
 *                 example: Heart care department
 *               code:
 *                 type: string
 *                 example: CARD
 *     responses:
 *       201:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input or department already exists
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all departments
 *     description: Retrieve all departments (Admin only)
 *     tags:
 *       - Admin Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Departments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/departments",
    authMiddleware,
    authorizeRoles("ADMIN"),
    createDepartment
);

router.get(
    "/departments",
    authMiddleware,
    authorizeRoles("ADMIN"),
    getDepartments
);

/**
 * @swagger
 * /api/v1/admin/departments/{departmentId}:
 *   get:
 *     summary: Get department by ID
 *     description: Retrieve a specific department (Admin only)
 *     tags:
 *       - Admin Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Department not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update a department
 *     description: Modify department details (Admin only)
 *     tags:
 *       - Admin Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Department ID
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
 *               code:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Department updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Department not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete a department
 *     description: Remove a department (Admin only)
 *     tags:
 *       - Admin Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Department not found
 *       409:
 *         description: Cannot delete department with active staff
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/departments/:departmentId",
    authMiddleware,
    authorizeRoles("ADMIN"),
    getDepartmentById
);

router.put(
    "/departments/:departmentId",
    authMiddleware,
    authorizeRoles("ADMIN"),
    updateDepartment
);

router.delete(
    "/departments/:departmentId",
    authMiddleware,
    authorizeRoles("ADMIN"),
    deleteDepartment
);

export default router;