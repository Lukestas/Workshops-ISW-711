function assignEditEvents() {
  document.querySelectorAll('.edit_button').forEach(el => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      const id = e.target.id;
      if (e.target.classList.contains('teacher_edit')) {
        console.log(`Profesor a editar: ${id}`);
        await editTeacher(id);
      } else if (e.target.classList.contains('course_edit')) {
        console.log(`Curso a editar: ${id}`);
        await editCourse(id);
      }
    });
  });
}

async function editCourse(courseId) {
  try {
    const response = await fetch(`http://localhost:3001/courses?id=${courseId}`);
    const course = await response.json();

    document.getElementById('name').value = course.name;
    document.getElementById('code').value = course.code;
    document.getElementById('description').value = course.description;
    document.getElementById('teacher').value = course.teacher;

    const saveButton = document.querySelector("button[onclick='createCourse(); return false;']");
    saveButton.setAttribute("onclick", `updateCourse('${courseId}'); return false;`);
  } catch (error) {
    console.error("Error al cargar los datos del curso:", error);
  }
}

async function updateCourse(courseId) {
  let updatedCourse = {
    name: document.getElementById('name').value,
    code: document.getElementById('code').value,
    description: document.getElementById('description').value,
    teacher: document.getElementById('teacher').value
  };

  const response = await fetch(`http://localhost:3001/courses?id=${courseId}`, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedCourse)
  });

  if (response.ok) {
    getCourses();
    alert('Curso actualizado');
  } else {
    alert("Error al actualizar el curso");
  }
}

async function editTeacher(teacherId) {
  try {
    const response = await fetch(`http://localhost:3001/teachers?id=${teacherId}`);
    const teacher = await response.json();

    document.getElementById('first_name').value = teacher.first_name;
    document.getElementById('last_name').value = teacher.last_name;
    document.getElementById('cedula').value = teacher.cedula;
    document.getElementById('age').value = teacher.age;

    const saveButton = document.querySelector("button[onclick='createTeacher(); return false;']");
    saveButton.setAttribute("onclick", `updateTeacher('${teacherId}'); return false;`);

    alert("Datos cargados. Modifique y guarde los cambios.");
  } catch (error) {
    console.error("Error cargando datos del profesor:", error);
    alert("Error cargando datos del profesor.");
  }
}

async function updateTeacher(teacherId) {
  try {
    let updatedTeacher = {
      first_name: document.getElementById('first_name').value,
      last_name: document.getElementById('last_name').value,
      cedula: document.getElementById('cedula').value,
      age: document.getElementById('age').value
    };

    const response = await fetch(`http://localhost:3001/teachers?id=${teacherId}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTeacher)
    });

    alert("Profesor actualizado exitosamente!");

    const saveButton = document.querySelector("button[onclick*='updateTeacher']");
    saveButton.setAttribute("onclick", "createTeacher(); return false;");

    getTeachers();
    loadTeacherForCourses();
  } catch (error) {
    console.error("Error actualizando el profesor:", error);
    alert("No se pudo actualizar el profesor.");
  }
}

async function getTeachers() {
  const response = await fetch("http://localhost:3001/teachers");
  const teachers = await response.json();
  console.log('teachers:', teachers);
  if (teachers) {
    const container = document.getElementById('result');
    container.innerHTML = '';
    teachers.forEach(element => {
      const item = document.createElement('li');
      item.innerHTML = `${element.first_name} ${element.last_name} <a href="" class="edit_button teacher_edit" id="${element._id}">Edit</a>`;
      item.setAttribute('data-id', element._id);
      container.appendChild(item)
    });
    assignEditEvents();
  }
}

async function createTeacher() {
  let teacher = {
    first_name: document.getElementById('first_name').value,
    last_name: document.getElementById('last_name').value,
    cedula: document.getElementById('cedula').value,
    age: document.getElementById('age').value
  }
  const response = await fetch("http://localhost:3001/teachers", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(teacher)
  });
  debugger;
  if (response && response.status == 201) {
    teacher = await response.json();
    getTeachers();
    loadTeacherForCourses();
    console.log('Teacher saved', teacher);
    alert('Usuario guardado');
  } else {
    alert("Shit's on fire! ");
  }
}

async function createCourse() {
  let course = {
    name: document.getElementById('name').value,
    code: document.getElementById('code').value,
    description: document.getElementById('description').value,
    teacher: document.getElementById('teacher').value
  }
  const response = await fetch("http://localhost:3001/courses", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(course)
  });
  debugger;
  if (response && response.status == 201) {
    course = await response.json();
    getCourses();
    console.log('Course saved', course);
    alert('Curso guardado');
  } else {
    alert("No se creo el curso! ");
  }
}

async function getCourses() {
  const response = await fetch("http://localhost:3001/courses");
  const courses = await response.json();
  console.log('courses:', courses);
  if (courses) {
    const container = document.getElementById('result_courses');
    container.innerHTML = '';
    courses.forEach(element => {
      const item = document.createElement('li');
      item.innerHTML = `${element.name} ${element.code} <a href="" class="edit_button course_edit" id="${element._id}">Edit</a>`;
      item.setAttribute('data-id', element._id);
      container.appendChild(item)
    });
    assignEditEvents();
  }
}

async function loadTeacherForCourses(){
  try{
    let response= await fetch("http://localhost:3001/teachers");
    let teachers= await response.json();
    let select= document.getElementById("teacher");
    select.innerHTML = '<option value="">Seleccione un profesor</option>';
        teachers.forEach(teacher => {
            let option = document.createElement("option");
            option.value = teacher._id;
            option.textContent = teacher.first_name + " " + teacher.last_name;
            select.appendChild(option);
        });
  }catch (error) { 
    console.error("Error cargando profesores:", error);
  }
}

window.onload = function () {
  loadTeacherForCourses();
  getTeachers();
  getCourses();
};