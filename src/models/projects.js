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

/**
 * Get the next N upcoming service projects
 */
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

/**
 * Get details for a single service project by ID
 */
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

/**
 * Get all projects for a specific organization
 */
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

// Export all model functions
export {
  getAllProjects,
  getUpcomingProjects,
  getProjectDetails,
  getProjectsByOrganizationId,
};
