const exampleCourses = [
  new Course(
    1,
    "MDaemon",
    "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet.",
    "assets/course.jpg",
    "Julio Kolis",
    ["www.test1.com"]
  ),
  new Course(2, "MFS", "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.", "assets/course1.png", "Jarid Ranyard", [
    "www.teste2.com",
  ]),
  new Course(
    3,
    "DNA Sequencing",
    "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula.",
    "assets/course2.png",
    "Sallyanne Ealam",
    ["www.test3.com", "www.test3.com", "www.test3.com"]
  ),
  new Course(4, "PFGE", "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.", "assets/course3.png", "Mavra Bertin", [
    "www.test4.com",
  ]),
  new Course(5, "AAR", "Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu.", "assets/course4.jfif", "Camey Boule", [
    "www.test5.com",
    "www.test5.com",
    "www.test5.com",
  ]),
];

function getCourses() {
  return JSON.parse(localStorage.getItem("courses"));
}

function setCourses(data) {
  localStorage.setItem("courses", JSON.stringify(data));
}

function initialData() {
  let savedData = getCourses();
  if (savedData && savedData.length > 0) {
    savedData = savedData.map((el) => new Course(el._id, el._title, el._description, el._image, el._teacherName, el._classList));
  } else {
    savedData = exampleCourses;
  }
  return savedData;
}

const courses = initialData();

function clearFields() {
  $("form").trigger("reset");
}

function openToEdit(id) {
  const course = findCourseById(id);
  $("#title").val(course.title);
  $("#description").val(course.description);
  $("#image").val(course.image);
  $("#teacherName").val(course.teacherName);
  $("#classList").val(course.classList.join(" "));
  toggleModalText(false, id);
  $("#coursesModal").modal("show");
}

function createCourse(id, title, description, image, teacherName, classList) {
  id = courses[courses.length - 1]?.id;
  if (id) {
    id++;
  } else {
    id = 1;
  }
  courses.push(new Course(id, title, description, image, teacherName, classList));
  showCourses();
}

function updateCourse(id, title, description, image, teacherName, classList) {
  const source = {
    id,
    title,
    description,
    image,
    teacherName,
    classList,
  };
  const index = courses.findIndex((c) => c.id == id);
  const updatedCourse = Object.assign(courses[index], source);
  updatedCourse.modified_at = new Date();
  courses.splice(index, 1, updatedCourse);
}

function deleteCourse(id) {
  const index = courses.findIndex((c) => c.id == id);
  courses.splice(index, 1);
  showCourses();
}

function findCourseById(id) {
  return courses.find((c) => c.id == id);
}

function showCourses() {
  setCourses(courses);
  let html = "";
  courses.forEach((course) => (html += createRow(course)));
  $("tbody").html(html);
  toggleShowEmptyTable();
}

function openModal() {
  clearFields();
  toggleModalText(true);
  $("#coursesModal").modal("show");
}

function searchCourseById() {
  let id = $("#searchId").val();
  try {
    if (!id || id <= 0) {
      throw new Error("The code must be greater than zero!");
    }
    let html = createViewModalBody(findCourseById(id));
    $("#viewCourseModalBody").html(html);
    $("#viewCourseModal").modal("show");
  } catch (err) {
    throwError("Error while searching for the course: " + err.message);
  }
}

function createRow(course) {
  return `
    <tr class="alert" role="alert">
      <td>${course.id}</td>
      <td>
        <span>${course.title}</span>
      </td>
      <td class="d-flex align-items-center">
        <object style="background-image: url(course.jpg) type="image/png">
          <div class="img" style="background-image: url(${course.image})"></div>
        </object>
        
        <div class="pl-3 email">
          <span>${course.description}</span>
          <span>Added: ${new Intl.DateTimeFormat("pt-BR").format(course.created_at)}</span>
          <span>Modified: ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(course.modified_at)}</span>
        </div>
      </td>
      <td class="text-center">${course.teacherName}</td>
      <td class="text-center">${course.classList?.map((el) => `<a href="${el}">${el}</a>`).join("<br>")}</td>
      <td>
        <div class="d-flex justify-content-around">
          <i class="fa fa-edit fa-2x edit" onclick="openToEdit(${course.id})"></i>
          <i class="fa fa-trash fa-2x close" onclick="deleteCourse(${course.id})"></i>
        </div>
      </td>
    </tr>
  `;
}

function createViewModalBody(course) {
  if (!course) {
    throw new Error("There is no such course with that index!");
  }
  return `
    <div class="img" style="background-image: url(${course.image})"></div>
    <div class="mb-1 mt-2">
      <h5 class="d-inline">Title: </h5><span>${course.title}</span>
    </div>
    <div class="mb-1">
      <h5 class="d-inline">Description: </h5><span>${course.description}</span>
    </div>
    <div class="mb-1">
      <h5 class="d-inline">Teacher name: </h5><span>${course.teacherName}</span>
    </div>
    <div>
    <h5>List of classes:</h5>
      <ul>${course.classList.map((el) => `<li><a href="${el}">${el}</a></li>`).join("")}</ul>
    </div>    
  `;
}

function getValuesFromForm() {
  return [
    Number($("#modalTitle").text().split(":")[1]) ?? 0,
    $("#title").val(),
    $("#description").val(),
    $("#image").val(),
    $("#teacherName").val(),
    $("#classList").val().split(" "),
  ];
}

function hasEmptyValues() {
  return !$("#title").val() || !$("#description").val() || !$("#image").val() || !$("#teacherName").val() || !$("#classList").val();
}

function submitForm(event) {
  event.preventDefault();
  try {
    if (hasEmptyValues()) {
      throw new Error("You must fill the required fields first.");
    }

    if ($("#modalButton").text() === "Save") {
      createCourse(...getValuesFromForm());
      throwSuccess("Successfully created a new course!");
    } else {
      updateCourse(...getValuesFromForm());
      throwSuccess("Successfully edited the course!");
    }
    showCourses();
    $("#coursesModal").modal("hide");
  } catch (err) {
    throwError("Error creating a new course! " + err.message);
  }
}

function throwSuccess(text) {
  Swal.fire({
    title: "Success!",
    text,
    icon: "success",
    showConfirmButton: false,
    timer: 1000,
  });
}

function throwError(text) {
  Swal.fire({
    title: "Error!",
    text,
    icon: "error",
  });
}

function toggleModalText(isCreating, id) {
  if (isCreating) {
    $("#modalTitle").text("Create a course");
    $("#modalButton").text("Save");
  } else {
    $("#modalTitle").text("Editing course: " + id);
    $("#modalButton").text("Edit");
  }
}

function toggleShowEmptyTable() {
  if (courses.length > 0) {
    $("#coursesTable").css("display", "block");
    $("#emptyTable").css("visibility", "hidden");
  } else {
    $("#emptyTable").css("visibility", "visible");
    $("#coursesTable").css("display", "none");
  }
}

$("#coursesModal").on("hidden.bs.modal", function (e) {
  let validator = $("#modalForm").validate();
  validator.resetForm();
});

showCourses();
