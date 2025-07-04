type course_reg {
    id: uuid!
    student_id: uuid!
    subject_id: uuid!
    class_id: uuid!
    term: String!
    session: String!
    
    student: users @relationship(type: "users", field: "student_id")
    subject: subjects @relationship(type: "subjects", field: "subject_id")
    class: classes @relationship(type: "classes", field: "class_id")
  }
  