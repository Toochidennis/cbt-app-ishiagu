type questions {
    id: uuid!
    subject_id: uuid!
    class_id: uuid!
    question_text: String!
    options: jsonb!
    correct_option: String!
    marks: Int!
    created_by: uuid
    created_at: timestamptz!
    
    subject: subjects @relationship(type: "subjects", field: "subject_id")
    class: classes @relationship(type: "classes", field: "class_id")
    creator: users @relationship(type: "users", field: "created_by")
  }
  