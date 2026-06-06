import { body, validationResult } from "express-validator";
import { getAllOrganizations } from "../models/organizations.js";

// Import model functions
import {
  getUpcomingProjects,
  getProjectDetails,
  getCategoriesByProjectId,
  createProject,
  updateProject, // ← New
} from "../models/projects.js";

// Validation rules 
const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 200 })
    .withMessage("Location must be less than 200 characters"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date format"),
  body("organizationId")
    .notEmpty()
    .withMessage("Organization is required")
    .isInt()
    .withMessage("Organization must be a valid integer"),
];

// Constant
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// ==================== EXISTING CONTROLLERS ====================

const showProjectsPage = async (req, res) => {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render("projects", {
      title: "Upcoming Service Projects",
      projects,
    });
  } catch (error) {
    console.error("Error fetching upcoming projects:", error);
    res.status(500).send("Server Error");
  }
};

const showProjectDetailsPage = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);

    if (!project) {
      return res.status(404).send("Project not found");
    }

    res.render("project", {
      title: project.title,
      project,
      categories,
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).send("Server Error");
  }
};

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "Add New Service Project";

  res.render("new-project", { title, organizations });
};

const processNewProjectForm = async (req, res) => {
  const { title, description, location, date, organizationId } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("/new-project");
  }

  try {
    const newProjectId = await createProject(
      title,
      description,
      location,
      date,
      organizationId,
    );
    req.flash("success", "New service project created successfully!");
    res.redirect(`/project/${newProjectId}`);
  } catch (error) {
    console.error("Error creating new project:", error);
    req.flash("error", "There was an error creating the service project.");
    res.redirect("/new-project");
  }
};

// ==================== NEW EDIT FUNCTIONS ====================

const showEditProjectForm = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    if (!project) {
      return res.status(404).send("Project not found");
    }

    res.render("edit-project", {
      title: `Edit Project: ${project.title}`,
      project,
      organizations,
    });
  } catch (error) {
    console.error("Error fetching project for edit:", error);
    res.status(500).send("Server Error");
  }
};

const processEditProjectForm = async (req, res) => {
  const projectId = req.params.id;
  const { title, description, location, date, organizationId } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect(`/edit-project/${projectId}`);
  }

  try {
    await updateProject(
      projectId,
      title,
      description,
      location,
      date,
      organizationId,
    );

    req.flash("success", "Project updated successfully!");
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Error updating project:", error);
    req.flash("error", "Failed to update project.");
    res.redirect(`/edit-project/${projectId}`);
  }
};

// Export all controller functions
export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm, // ← New
  processEditProjectForm, // ← New
  projectValidation,
};
