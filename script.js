document.addEventListener('DOMContentLoaded', () => {
     const sidebar = document.querySelector('.sidebar');
     const sidebarButton = document.querySelector('.sidebar_button');
     const opensideBar = document.querySelector('.open_sidebar');
      //открытие сайдбара
     sidebarButton.addEventListener('click', ()=> {
        sidebar.classList.add('closed');
        opensideBar.classList.add('show');
     });

     opensideBar.addEventListener('click', () => {
        sidebar.classList.remove('closed');
        opensideBar.classList.remove('show');
     });

        //переключение вкладок
     const projectPage = document.querySelector('.projects');
     const employeesPage = document.querySelector('.employees');
     const aProject = document.querySelector('.a_project');
     const aEmployees = document.querySelector('.a_employees');

     aEmployees.addEventListener('click', () => { 
        employeesPage.style.display = "block";
        projectPage.style.display = "none";
     });

     aProject.addEventListener('click', () => {
        projectPage.style.display = "block";
        employeesPage.style.display = "none";
     });

       // попап add project
        const popup = document.getElementById('popup');
        const popupOverlay = document.getElementById('popupOverlay');
        const openPopupBtn = document.querySelector('.add_project');
        const cancelBtn = document.getElementById('cancelBtn');
        const form = document.getElementById('projectForm');
        const submitBtn = document.getElementById('submitBtn');
        const formErrors = document.getElementById('formErrors');
        const projectsRows = document.getElementById('projectsRows');
        const totalIncomeValue = document.getElementById('totalIncomeValue');

        const fields = {
            projectName: document.getElementById('projectName'),
            companyName: document.getElementById('companyName'),
            budget: document.getElementById('budget'),
            capacity: document.getElementById('capacity')
        };

        openPopupBtn.addEventListener('click', () => {
            popup.classList.add('show');
        });
        

        function isAlphanumericText(value) {
            return /^[a-zA-Zа-яА-ЯёЁ0-9\s]+$/.test(value);
        }

        function hasTwoDecimals(value) {
            return /^\d+(\.\d{1,2})?$/.test(value);
        }

        function validateProjectName(){
            const value = fields.projectName.value.trim();
            if (!value) return "Project Name is required";
            if (value.length < 3) return "Enter minimum 3 characters";
            if (!isAlphanumericText(value)) return "Enter only letters and numbers";
            return '';
        }

        function validateCompanyname() {
            const value = fields.companyName.value.trim();
            if (!value) return "Company Name is required";
            if (value.length < 2) return "Enter minimum 2 characters";
            if (!isAlphanumericText(value)) return "Enter only letters and numbers";
            return '';
        }

        function validateBudget() {
            const value = fields.budget.value.trim();
            if (!value) return "Budget is required";
            if(!hasTwoDecimals(value)) return "Use a positive number with up to 2 decimal places.";
            if (Number(value) <= 0) return 'Budget must be greater than 0.';
            return '';
        }

        function validateCapacity() {
            const value = fields.capacity.value.trim();
            if (!value) return "Capacity is required";
            if (!/^\d+$/.test(value)) return 'Capacity must be a whole number.';
            if (Number(value) < 1) return 'Minimum value is 1.';
            return '';
        }

        function validateField(field) {
            let message = '';
            if (field === fields.projectName) message = validateProjectName();
            if (field === fields.companyName) message = validateCompanyname();
            if (field === fields.budget) message = validateBudget();
            if (field === fields.capacity) message = validateCapacity();

            const errorElement = field.nextElementSibling;
            errorElement.textContent = message;

            field.classList.remove('invalid', 'valid');
            if (field.value.trim() === '') {
                field.classList.remove('invalid', 'valid');
            } else if (message) {
                field.classList.add('invalid');
            } else {
                field.classList.add('valid');
            }
            return message;
        }

        function validateForm() {
            const errors = [
                validateField(fields.projectName),
                validateField(fields.companyName),
                validateField(fields.budget),
                validateField(fields.capacity),
            ].filter(Boolean);

            formErrors.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
            return errors.length === 0;
        }

        function allFieldsFilled() {
            return Object.values(fields).every(field => field.value.trim() !== '');
        }

        function updateSubmitState() {
            const isValid =
            !validateProjectName() &&
            !validateCompanyname() &&
            !validateBudget() &&
            !validateCapacity();
            submitBtn.disabled = !(allFieldsFilled() && isValid);
        }
        function clearValidation() {
            Object.values(fields).forEach(field => {
                field.classList.remove('invalid', 'valid');

                const errorElement = field.nextElementSibling;
                if (errorElement) {
                errorElement.textContent = '';
                }
            });

            formErrors.innerHTML = '';
            }

            Object.values(fields).forEach(field => {
            field.addEventListener('input', updateSubmitState);
            field.addEventListener('blur', () => {
                validateField(field);
                updateSubmitState();
            });
        });

        form.addEventListener('submit', event => {
            event.preventDefault();

            if (!validateForm()) {
            updateSubmitState();
            return;
            }
            const newProject = createProjectData();
            projects.push(newProject);
            saveProjectToLocalStorage();
            renderProjects();
            closePopup();
        });
        function closePopup() {
            popup.classList.remove('show');
            form.reset();
            clearValidation();
            updateSubmitState();
        }

        cancelBtn.addEventListener('click', () => {
            closePopup();
        });
        popupOverlay.addEventListener('click', () => {
            closePopup();
        });
        updateSubmitState();

       // сохранение и рендер projects
        const STORAGE_KEY = 'projectsData';
        const projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        function saveProjectToLocalStorage() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        }

        function createProjectData(){
            return {
                companyName: fields.companyName.value.trim(),
                projectName: fields.projectName.value.trim(),
                budget: Number(fields.budget.value.trim()),
                capacity: Number(fields.capacity.value.trim()),
                employees: 0,
                estimatedIncome: 0
            }
        }

        function updateTotalIncome() {
            const total = projects.reduce((sum, project) => {
                return sum + project.estimatedIncome;
            }, 0);

            totalIncomeValue.textContent = `$${total.toFixed(2)}`;
        }

        function renderProjects() {
            projectsRows.innerHTML = '';

             projects.forEach((project, index) => {
                const row = document.createElement('div');
                row.className = 'projects_search_panel projects_search_panel--row';

                row.innerHTML = `
                    <div class="cell">${project.companyName}</div>
                    <div class="cell">${project.projectName}</div>
                    <div class="cell">$${project.budget.toFixed(2)}</div>
                    <div class="cell">${project.capacity}</div>
                    <div class="cell">${project.employees}</div>
                    <div class="cell">$${project.estimatedIncome.toFixed(2)}</div>
                    <div class="cell">
                    <button class="delete_project" data-index="${index}">Delete</button>
                    </div>
                `;

                projectsRows.appendChild(row);
                });

                updateTotalIncome();
        }

        projectsRows.addEventListener('click', event => {
            const deleteButton = event.target.closest('.delete_project');
            if (!deleteButton) return;

            const index = Number(deleteButton.dataset.index);
            projects.splice(index, 1);
            saveProjectToLocalStorage();
            renderProjects();
        });

            renderProjects();
            updateSubmitState();

        



})


