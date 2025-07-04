type results {
    id: uuid!
    student_id: uuid!
    exam_schedule_id: uuid!
    total_score: numeric
    remarks: String
    created_at: timestamptz!
    
    student: users @relationship(type: "users", field: "student_id")
    exam_schedule: exam_schedules @relationship(type: "exam_schedules", field: "exam_schedule_id")
  }
  