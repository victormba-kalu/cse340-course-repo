import express from "express";
import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  showDashboard,
  requireRole,
} from "./controllers/users.js";
import { showOrganizationDetailsPage } from "./controllers/organizations.js";
import { showHomePage } from "./controllers/index.js";
import { showOrganizationsPage } from "./controllers/organizations.js";
import {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm,
} from "./controllers/projects.js";

import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm, // ← New
  processNewCategoryForm, // ← New
  showEditCategoryForm, // ← New
  processEditCategoryForm, // ← New
} from "./controllers/categories.js"; // ← Updated import

import { testErrorPage } from "./controllers/errors.js";
import { showNewOrganizationForm } from "./controllers/organizations.js";
import {
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
} from "./controllers/organizations.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get("/categories", showCategoriesPage);
router.get("/organization/:id", showOrganizationDetailsPage);

// Route for new organization page
router.get("/new-organization", requireRole("admin"), showNewOrganizationForm);

// New route for category details page
router.get("/category/:id", showCategoryDetailsPage); // ← Added

router.get("/project/:id", showProjectDetailsPage);

// Route to display the edit organization form
router.get(
  "/edit-organization/:id",
  requireRole("admin"),
  showEditOrganizationForm,
);

// Routes to handle the assign categories to project form
router.get(
  "/assign-categories/:projectId",
  requireRole("admin"),
  showAssignCategoriesForm,
);
router.post(
  "/assign-categories/:projectId",
  requireRole("admin"),
  processAssignCategoriesForm,
);

// Route to handle new organization form submission
router.post(
  "/new-organization",
  requireRole("admin"),
  organizationValidation,
  projectValidation,
  processNewOrganizationForm,
);

// Route to handle the edit organization form submission
router.post(
  "/edit-organization/:id",
  requireRole("admin"),
  projectValidation,
  processEditOrganizationForm,
);

// User login routes
router.get("/login", showLoginForm);
router.post("/login", processLoginForm);
router.get("/logout", processLogout);

// Protected dashboard route
router.get("/dashboard", requireLogin, showDashboard);

// ==================== NEW EDIT PROJECT ROUTES ====================

// Route to display the edit project form
router.get("/edit-project/:id", requireRole("admin"), showEditProjectForm);

// Route to handle the edit project form submission
router.post(
  "/edit-project/:id",
  requireRole("admin"),
  projectValidation,
  processEditProjectForm,
);

// ==================== NEW CATEGORY ROUTES ====================

// Route to display the new category form
router.get("/new-category", requireRole("admin"), showNewCategoryForm);

// Route to handle new category form submission
router.post("/new-category", requireRole("admin"), processNewCategoryForm);

// Route to display the edit category form
router.get("/edit-category/:id", requireRole("admin"), showEditCategoryForm);

// Route to handle the edit category form submission
router.post(
  "/edit-category/:id",
  requireRole("admin"),
  processEditCategoryForm,
);

// Route for new project page
router.get("/new-project", requireRole("admin"), showNewProjectForm);

// Route to handle new project form submission
router.post("/new-project", requireRole("admin"), processNewProjectForm);

// User registration routes
router.get("/register", showUserRegistrationForm);
router.post("/register", processUserRegistrationForm);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
