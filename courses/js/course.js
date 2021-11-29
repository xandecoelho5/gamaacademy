class Course {
  constructor(id, title, description, image, teacherName, classList) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._image = image;
    this._teacherName = teacherName;
    this._classList = classList;
    this._created_at = new Date();
    this._modified_at = new Date();
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get image() {
    return this._image;
  }

  get teacherName() {
    return this._teacherName;
  }

  get classList() {
    return this._classList;
  }

  set id(id) {
    return (this._id = id);
  }

  set title(title) {
    return (this._title = title);
  }

  set description(description) {
    return (this._description = description);
  }

  set image(image) {
    return (this._image = image);
  }

  set teacherName(teacherName) {
    return (this._teacherName = teacherName);
  }

  set classList(classList) {
    return (this._classList = classList);
  }

  set modified_at(date) {
    return (this._modified_at = date);
  }
}
