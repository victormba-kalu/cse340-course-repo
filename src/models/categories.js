// src/models/categories.js
import db from "./db.js";

/**
 * Get all service project categories
 */
const getAllCategories = async () => {
  const query = `
        SELECT 
            category_id,
            name
        FROM category
        ORDER BY name ASC;
    `;

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to retrieve categories");
  }
};

/**
 * Get a single category by ID
 */
const getCategoryById = async (categoryId) => {
  const query = `
        SELECT 
            category_id,
            name
        FROM category
        WHERE category_id = $1;
    `;

  try {
    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw new Error("Failed to retrieve category");
  }
};

const assignCategoryToProject = async (categoryId, projectId) => {
  const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

  await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
  // First, remove existing category assignments for the project
  const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
  await db.query(deleteQuery, [projectId]);

  // Next, add the new category assignments
  for (const categoryId of categoryIds) {
    await assignCategoryToProject(categoryId, projectId);
  }
};

/**
 * Get all categories for a specific service project (Many-to-Many)
 */
const getCategoriesByProjectId = async (projectId) => {
  const query = `
        SELECT 
            c.category_id,
            c.name
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;

  try {
    const result = await db.query(query, [projectId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching categories by project:", error);
    throw new Error("Failed to retrieve categories for project");
  }
};

/**
 * Get all service projects for a specific category
 */
const getProjectsByCategoryId = async (categoryId) => {
  const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date ASC;
    `;

  try {
    const result = await db.query(query, [categoryId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching projects by category:", error);
    throw new Error("Failed to retrieve projects for category");
  }
};

/* ==================== NEW FUNCTIONS FOR THIS ASSIGNMENT ==================== */

/**
 * Create a new category
 */
const createCategory = async (name) => {
  const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id;
    `;

  try {
    const result = await db.query(query, [name]);

    if (result.rows.length === 0) {
      throw new Error("Failed to create category");
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
      console.log("Created new category with ID:", result.rows[0].category_id);
    }

    return result.rows[0].category_id;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};

/**
 * Update an existing category
 */
const updateCategory = async (categoryId, name) => {
  const query = `
        UPDATE category 
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

  try {
    const result = await db.query(query, [name, categoryId]);

    if (result.rows.length === 0) {
      throw new Error("Category not found or could not be updated");
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
      console.log("Updated category with ID:", categoryId);
    }

    return result.rows[0].category_id;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

// Export all model functions
export {
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
  updateCategoryAssignments,
  createCategory, // ← New
  updateCategory, // ← New
};
