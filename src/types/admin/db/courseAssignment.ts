type courseAssignmentDb {
    id: uuid!
    staff_id: uuid!
    subject_id: uuid!
    class_id: uuid!
    
    staff: users @relationship(type: "users", field: "staff_id")
    subject: subjects @relationship(type: "subjects", field: "subject_id")
    class: classes @relationship(type: "classes", field: "class_id")
  }
  