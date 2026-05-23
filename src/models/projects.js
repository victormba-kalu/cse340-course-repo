// src/data/projects.js

/**
 * Get all service projects with their sponsoring organization
 */

// src/data/projects.js
import db from "./db.js";

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
        console.error('Error fetching service projects:', error);
        throw new Error('Failed to retrieve service projects');
    }
};

export { getAllProjects };