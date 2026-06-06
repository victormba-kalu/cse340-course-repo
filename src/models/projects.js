
// src/models/projects.js
import db from "./db.js";

/**
 * Get all service projects with their sponsoring organization
 */

const getAllProjects = async () => {
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
        ORDER BY p.date ASC;
    `;

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching service projects:", error);
    throw new Error("Failed to retrieve service projects");
  }
};

const getUpcomingProjects = async (number_of_projects = 5) => {
  const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.organization_id,
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;

  try {
    const result = await db.query(query, [number_of_projects]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching upcoming projects:", error);
    throw new Error("Failed to retrieve upcoming projects");
  }
};

const getProjectDetails = async (projectId) => {
  const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.organization_id,
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

  try {
    const result = await db.query(query, [projectId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw new Error("Failed to retrieve project details");
  }
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY date;
    `;

  try {
    const result = await db.query(query, [organizationId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching projects by organization:", error);
    throw error;
  }
};

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

/* ==================== CREATE FUNCTION  ==================== */

const createProject = async (title, description, location, date, organizationId) => {
  const query = `
      INSERT INTO service_project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID:", result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

/* ==================== NEW UPDATE FUNCTION ==================== */

const updateProject = async (projectId, title, description, location, date, organizationId) => {
  const query = `
        UPDATE service_project 
        SET title = $1,
            description = $2,
            location = $3,
            date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

  const queryParams = [title, description, location, date, organizationId, projectId];

  try {
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
      throw new Error("Project not found or could not be updated");
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
      console.log("Updated project with ID:", projectId);
    }

    return result.rows[0].project_id;
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error("Failed to update project");
  }
};

// Export all model functions
export { 
  getAllProjects, 
  getUpcomingProjects, 
  getProjectDetails, 
  getProjectsByOrganizationId,
  getCategoriesByProjectId,
  createProject,
  updateProject     
};