// Import any needed model functions
import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  updateCategoryAssignments,
  createCategory, // ← New
  updateCategory, // ← New
} from "../models/categories.js";
import { getProjectDetails } from "../models/projects.js";

import { body, validationResult } from "express-validator";

// Category Validation Rules
const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters"),
];

// Define any controller functions
const showCategoriesPage = async (req, res) => {
  try {
    const categories = await getAllCategories();
    const title = "Service Categories";

    res.render("categories", {
      title,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Server Error");
  }
};

const showCategoryDetailsPage = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.render("category", {
      title: category.name,
      category,
      projects,
    });
  } catch (error) {
    console.error("Error fetching category details:", error);
    res.status(500).send("Server Error");
  }
};

// ==================== NEW CREATE CATEGORY FUNCTIONS ====================

const showNewCategoryForm = async (req, res) => {
  const title = "Add New Category";
  res.render("new-category", { title });
};

const processNewCategoryForm = async (req, res) => {
  const { name } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("/new-category");
  }

  try {
    await createCategory(name);
    req.flash("success", "Category created successfully!");
    res.redirect("/categories");
  } catch (error) {
    console.error("Error creating category:", error);
    req.flash("error", "Failed to create category.");
    res.redirect("/new-category");
  }
};

// ==================== NEW EDIT CATEGORY FUNCTIONS ====================

const showEditCategoryForm = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    const title = `Edit Category: ${category.name}`;
    res.render("edit-category", {
      title,
      category,
    });
  } catch (error) {
    console.error("Error fetching category for edit:", error);
    res.status(500).send("Server Error");
  }
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect(`/edit-category/${categoryId}`);
  }

  try {
    await updateCategory(categoryId, name);
    req.flash("success", "Category updated successfully!");
    res.redirect("/categories");
  } catch (error) {
    console.error("Error updating category:", error);
    req.flash("error", "Failed to update category.");
    res.redirect(`/edit-category/${categoryId}`);
  }
};

const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;

  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByProjectId(projectId);

  const title = "Assign Categories to Project";

  res.render("assign-categories", {
    title,
    projectId,
    projectDetails,
    categories,
    assignedCategories,
  });
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categoryIds || [];

  const categoryIdsArray = Array.isArray(selectedCategoryIds)
    ? selectedCategoryIds
    : [selectedCategoryIds];

  await updateCategoryAssignments(projectId, categoryIdsArray);
  req.flash("success", "Categories updated successfully.");
  res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation,
};
