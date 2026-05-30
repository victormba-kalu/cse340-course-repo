// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from "../models/projects.js";

// Constant for how many upcoming projects to show
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render("projects", {
      title: "Upcoming Service Projects", // Updated title as requested
      projects,
    });
  } catch (error) {
    console.error("Error fetching upcoming projects:", error);
    res.status(500).send("Server Error");
  }
};

const showProjectDetailsPage = async (req, res) => {
  try {
    const projectId = req.params.id; // Get ID from URL
    const project = await getProjectDetails(projectId);

    if (!project) {
      return res.status(404).send("Project not found");
    }

    res.render("project", {
      // Renders project.ejs
      title: project.title,
      project,
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).send("Server Error");
  }
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };
