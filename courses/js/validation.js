$("#modalForm").validate({
  debug: true,
  rules: {
    title: "required",
    description: "required",
    teacherName: "required",
    image: "required",
    classList: "required",
  },
});
