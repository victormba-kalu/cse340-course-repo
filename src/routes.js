import express from "express";
import { showOrganizationDetailsPage } from "./controllers/organizations.js";
import { showHomePage } from "./controllers/index.js";
import { showOrganizationsPage } from "./controllers/organizations.js";
import {
  showProjectsPage,
  showProjectDetailsPage,
} from "./controllers/projects.js"; // ← Updated import
import { showCategoriesPage } from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get("/categories", showCategoriesPage);
router.get("/organization/:id", showOrganizationDetailsPage);

// New route for individual service project details
router.get("/project/:id", showProjectDetailsPage); // ← Added

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
