(function () {
  const STORAGE_KEY = 'dashboardData';

  function getDashboardData() {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);

      if (!rawData) {
        return {
          projects: [],
          employees: []
        };
      }

      const parsedData = JSON.parse(rawData);

      return {
        projects: Array.isArray(parsedData.projects) ? parsedData.projects : [],
        employees: Array.isArray(parsedData.employees) ? parsedData.employees : []
      };
    } catch (error) {
      console.error('Error reading dashboardData from localStorage:', error);
      return {
        projects: [],
        employees: []
      };
    }
  }

  function saveDashboardData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getProjects() {
    return getDashboardData().projects;
  }

  function saveProjects(projects) {
    const data = getDashboardData();
    data.projects = Array.isArray(projects) ? projects : [];
    saveDashboardData(data);
  }

  function getEmployees() {
    return getDashboardData().employees;
  }

  function saveEmployees(employees) {
    const data = getDashboardData();
    data.employees = Array.isArray(employees) ? employees : [];
    saveDashboardData(data);
  }

  function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  window.storage = {
    getDashboardData,
    saveDashboardData,
    getProjects,
    saveProjects,
    getEmployees,
    saveEmployees,
    generateId
  };
})();