document.addEventListener('DOMContentLoaded', () => {
  const popupEmployees = document.getElementById('popup_employees');
  const employeePopupOverlay = document.getElementById('employeePopupOverlay');
  const openpopupEmployeeBtn = document.querySelector('.add_employee');
  const employeeCancelBtn = document.getElementById('employeeCancelBtn');
  const employeeSubmitBtn = document.getElementById('employeeSubmitBtn');
  const formEmployees = document.getElementById('employeeForm');
  const employeesRows = document.getElementById('employeesRows');
  const employeeFormErrors = document.getElementById('employeeFormErrors');

  const employeeFields = {
    name: document.getElementById('employeeName'),
    surname: document.getElementById('employeeSurname'),
    birth: document.getElementById('employeeBirthDate'),
    position: document.getElementById('employeePosition'),
    salary: document.getElementById('employeeSalary')
  };

  let employees = window.storage.getEmployees();

  openpopupEmployeeBtn.addEventListener('click', () => {
    popupEmployees.classList.add('show');
  });

  employeeCancelBtn.addEventListener('click', closeEmployeePopup);
  employeePopupOverlay.addEventListener('click', closeEmployeePopup);

  function isLettersOnly(value) {
    return /^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value);
  }

  function hasTwoDecimals(value) {
    return /^\d+(\.\d{1,2})?$/.test(value);
  }

  function calculateAge(date) {
    if (!date) return '';

    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  function validateName() {
    const value = employeeFields.name.value.trim();
    if (!value) return 'Name is required';
    if (value.length < 3) return 'Enter minimum 3 characters';
    if (!isLettersOnly(value)) return 'Enter only letters';
    return '';
  }

  function validateSurname() {
    const value = employeeFields.surname.value.trim();
    if (!value) return 'Surname is required';
    if (value.length < 3) return 'Enter minimum 3 characters';
    if (!isLettersOnly(value)) return 'Enter only letters';
    return '';
  }

  function validateBirth() {
  const value = employeeFields.birth.value;
  if (!value) return 'Date of Birth is required';
  const age = calculateAge(value);
  if (age < 18) return 'Employee must be at least 18 years old';

  return '';
}

  function validatePosition() {
    const value = employeeFields.position.value;
    if (!value) return 'Choose position';
    return '';
  }

  function validateSalary() {
    const value = employeeFields.salary.value.trim();
    if (!value) return 'Salary is required';
    if (!hasTwoDecimals(value)) return 'Use a positive number with up to 2 decimal places.';
    if (Number(value) <= 0) return 'Salary must be greater than 0.';
    return '';
  }

  function validateEmployeeField(field) {
    let message = '';

    if (field === employeeFields.name) message = validateName();
    if (field === employeeFields.surname) message = validateSurname();
    if (field === employeeFields.birth) message = validateBirth();
    if (field === employeeFields.position) message = validatePosition();
    if (field === employeeFields.salary) message = validateSalary();

    const errorElement = field.nextElementSibling;
    if (errorElement) {
      errorElement.textContent = message;
    }

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

  function validateEmployeeForm() {
    const errors = [
      validateEmployeeField(employeeFields.name),
      validateEmployeeField(employeeFields.surname),
      validateEmployeeField(employeeFields.birth),
      validateEmployeeField(employeeFields.position),
      validateEmployeeField(employeeFields.salary)
    ].filter(Boolean);

    employeeFormErrors.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
    return errors.length === 0;
  }

  function allEmployeeFieldsFilled() {
    return [
      employeeFields.name,
      employeeFields.surname,
      employeeFields.birth,
      employeeFields.position,
      employeeFields.salary
    ].every(field => field.value.trim() !== '');
  }

  function updateEmployeeSubmitState() {
    const isValid =
      !validateName() &&
      !validateSurname() &&
      !validateBirth() &&
      !validatePosition() &&
      !validateSalary();

    employeeSubmitBtn.disabled = !(allEmployeeFieldsFilled() && isValid);
  }

  function clearEmployeeValidation() {
    Object.values(employeeFields).forEach(field => {
      if (!field) return;

      field.classList.remove('invalid', 'valid');
      const errorElement = field.nextElementSibling;
      if (errorElement) {
        errorElement.textContent = '';
      }
    });

    employeeFormErrors.innerHTML = '';
  }

  Object.values(employeeFields).forEach(field => {

    field.addEventListener('input', () => {
      if (field === employeeFields.birth) {
        validateBirth();
      }
      updateEmployeeSubmitState();
    });

    field.addEventListener('blur', () => {
      validateEmployeeField(field);
      updateEmployeeSubmitState();
    });
  });

  function createEmployeeData() {
    return {
      id: window.storage.generateId('employee'),
      name: employeeFields.name.value.trim(),
      surname: employeeFields.surname.value.trim(),
      birthDate: employeeFields.birth.value,
      age: calculateAge(employeeFields.birth.value),
      position: employeeFields.position.value,
      salary: Number(employeeFields.salary.value),
      estimatedPayment: 0,
      project: '',
      projectedIncome: 0,
      capacity: 0,
    };
  }

  function renderEmployees() {
    employees = window.storage.getEmployees();
    employeesRows.innerHTML = '';

    employees.forEach((employee, index) => {
      const row = document.createElement('div');
      row.className = 'employees_row';

      row.innerHTML = `
        <div class="cell">${employee.name}</div>
        <div class="cell">${employee.surname}</div>
        <div class="cell">${employee.age}</div>
        <div class="cell">${employee.position}</div>
        <div class="cell">$${employee.salary.toFixed(2)}</div>
        <div class="cell">$${employee.estimatedPayment.toFixed(2)}</div>
        <div class="cell">${employee.project || '-'}</div>
        <div class="cell">$${employee.projectedIncome.toFixed(2)}</div>
        <div class="cell">
          <div class="cell actions_cell">
            <button class="availability_employee" data-index="${index}" type="button">
                Availability
            </button>
            <button 
                class="assign_employee" 
                data-index="${index}" 
                type="button"
                ${employee.capacity >= 1.5 ? 'disabled' : ''}
            >
                Assign
            </button>
            <button class="delete_employee" data-index="${index}" type="button">
                Delete
            </button>
            </div>
        </div>
      `;

      employeesRows.appendChild(row);
    });
  }

  formEmployees.addEventListener('submit', event => {
    event.preventDefault();

    if (!validateEmployeeForm()) {
      updateEmployeeSubmitState();
      return;
    }

    const newEmployee = createEmployeeData();
    employees.push(newEmployee);
    window.storage.saveEmployees(employees);
    renderEmployees();
    closeEmployeePopup();
  });

  employeesRows.addEventListener('click', event => {
    const deleteButton = event.target.closest('.delete_employee');
    if (!deleteButton) return;

    const index = Number(deleteButton.dataset.index);
    const employee = employees[index];

    const isConfirmed = confirm(
        `Delete employee ${employee.name} ${employee.surname}?`
    );
    if (!isConfirmed) return;
    employees.splice(index, 1);
    window.storage.saveEmployees(employees);
    renderEmployees();
    });

  function closeEmployeePopup() {
    popupEmployees.classList.remove('show');
    formEmployees.reset();
    clearEmployeeValidation();
    updateEmployeeSubmitState();
  }

  renderEmployees();
  updateEmployeeSubmitState();
});
