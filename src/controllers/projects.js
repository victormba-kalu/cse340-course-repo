// Import any needed model functions
import { getAllProjects } from "../models/projects.js";

// Define any controller functions
    const showProjectsPage = async (req, res) => {
    try {
        const projects = await getAllProjects();

        res.render("projects", {
        title: "Service Projects",
        projects,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// Export any controller functions
export { showProjectsPage };
