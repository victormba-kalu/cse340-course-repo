import express from "express";
import { showOrganizationDetailsPage } from "./controllers/organizations.js";
import { showHomePage } from "./controllers/index.js";
import { showOrganizationsPage } from "./controllers/organizations.js";
import {
  showProjectsPage,
  showProjectDetailsPage,
} from "./controllers/projects.js";
import {
  showCategoriesPage,
  showCategoryDetailsPage,
} from "./controllers/categories.js"; // ← Updated import
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get("/categories", showCategoriesPage);
router.get("/organization/:id", showOrganizationDetailsPage);

// New route for category details page
router.get("/category/:id", showCategoryDetailsPage); // ← Added

router.get("/project/:id", showProjectDetailsPage);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
