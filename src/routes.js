import express from "express";
import { showOrganizationDetailsPage } from "./controllers/organizations.js";
import { showHomePage } from "./controllers/index.js";
import { showOrganizationsPage } from "./controllers/organizations.js";
import {
    showProjectsPage, showProjectDetailsPage, showNewProjectForm,
    processNewProjectForm, projectValidation
} from "./controllers/projects.js";

import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm
} from "./controllers/categories.js"; // ← Updated import
import { testErrorPage } from "./controllers/errors.js";
import { showNewOrganizationForm } from "./controllers/organizations.js"; 
import { processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm } from "./controllers/organizations.js";
const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get("/categories", showCategoriesPage);
router.get("/organization/:id", showOrganizationDetailsPage);
// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// New route for category details page
router.get("/category/:id", showCategoryDetailsPage); // ← Added

router.get("/project/:id", showProjectDetailsPage);
// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, projectValidation, processNewOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', projectValidation, processEditOrganizationForm);

// Route for new project page
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', processNewProjectForm);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
