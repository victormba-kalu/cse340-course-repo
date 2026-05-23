-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

SELECT * FROM organization;

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organization(organization_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date DATE
);

INSERT INTO service_project 
    (organization_id, title, description, location, date)
VALUES
    -- BrightFuture Builders (organization_id = 1) - 5 projects
    (1, 'Community Playground Renovation', 'Rebuild and modernize the playground at Riverside Park using sustainable materials.', 'Riverside Park', '2026-06-18'),
    (1, 'Affordable Housing Repair Drive', 'Volunteer teams will repair and paint homes for low-income families.', 'Downtown Neighborhood', '2026-07-05'),
    (1, 'School Infrastructure Upgrade', 
     'Help renovate classrooms and improve facilities at Lincoln Elementary.', 
     'Lincoln Elementary School', '2026-06-25'),
     
    (1, 'Bridge Maintenance Project', 
     'Assist in cleaning and minor repairs of the community footbridge.', 
     'Riverwalk Trail', '2026-07-12'),
     
    (1, 'Public Park Beautification', 
     'Plant flowers, clean up trails, and install new benches.', 
     'Central Community Park', '2026-07-20'),

    -- GreenHarvest Growers (organization_id = 2) - 5 projects
    (2, 'Urban Garden Workshop Series', 
     'Teach community members how to build and maintain raised garden beds.', 
     'GreenHarvest Community Garden', '2026-06-22'),
     
    (2, 'Weekly Farmers Market Support', 
     'Setup, staffing, and produce distribution at the local farmers market.', 
     'City Plaza', '2026-06-28'),
     
    (2, 'School Vegetable Garden Project', 
     'Build and maintain vegetable gardens at local elementary schools.', 
     'Multiple Schools', '2026-07-08'),
     
    (2, 'Composting Education Program', 
     'Teach households how to compost and reduce food waste.', 
     'Various Neighborhoods', '2026-07-15'),
     
    (2, 'Community Orchard Planting', 
     'Plant fruit trees in public spaces for community harvesting.', 
     'Eastside Community Center', '2026-07-25'),

    -- UnityServe Volunteers (organization_id = 3) - 5 projects
    (3, 'Senior Center Technology Help', 
     'Assist seniors with smartphones, tablets, and video calls.', 
     'UnityServe Senior Center', '2026-07-03'),
     
    (3, 'Food Bank Sorting & Distribution', 
     'Sort donations and pack food boxes for families in need.', 
     'City Food Bank', '2026-06-30'),
     
    (3, 'Neighborhood Cleanup Day', 
     'Large-scale litter removal and beautification event.', 
     'Multiple Neighborhoods', '2026-07-10'),
     
    (3, 'Backpack & School Supply Drive', 
     'Collect and distribute school supplies to children in need.', 
     'UnityServe Warehouse', '2026-08-01'),
     
    (3, 'Community Wellness Fair', 
     'Organize health screenings, fitness activities, and wellness workshops.', 
     'Central Community Hall', '2026-07-18');

