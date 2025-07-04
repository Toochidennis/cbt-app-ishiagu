type exam_schedules {
    id: uuid!
    subject_id: uuid!
    class_id: uuid!
    exam_date: timestamptz!
    duration_minutes: Int!
    session: String!
    term: String!
    created_by: uuid
    description: String
    
    subject: subjects @relationship(type: "subjects", field: "subject_id")
    class: classes @relationship(type: "classes", field: "class_id")
    creator: users @relationship(type: "users", field: "created_by")
  }
  