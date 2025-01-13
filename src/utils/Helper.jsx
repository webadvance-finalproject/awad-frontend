export const organizeDepartments = (data) => {
    const { cast, crew } = data;
    
    // Create departments object from crew
    const departments = crew.reduce((acc, person) => {
      const dept = person.department;
      
      if (!acc[dept]) {
        acc[dept] = [];
      }
      
      acc[dept].push({
        adult: person.adult,
        gender: person.gender,
        id: person.id,
        known_for_department: person.known_for_department,
        name: person.name,
        original_name: person.original_name,
        popularity: person.popularity,
        profile_path: person.profile_path,
        credit_id: person.credit_id,
        department: person.department,
        job: person.job
      });
      
      return acc;
    }, {});
    
    // Sort each department array by popularity
    Object.keys(departments).forEach(dept => {
      departments[dept].sort((a, b) => b.popularity - a.popularity);
    });
    
    return {
      Cast: cast,  // Keep original cast array
      ...departments  // Organized crew by department
    };
  };