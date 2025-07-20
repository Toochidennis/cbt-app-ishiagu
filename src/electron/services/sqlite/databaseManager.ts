import { LocalDatabase } from './Database'
import {
    ClassRepository,
    CourseAssignmentRepository,
    CourseRegistrationRepository,
    ExamScheduleRepository,
    QuestionRepository,
    ResultRepository,
    SubjectRepository,
    UserRepository,
    SettingRepository,
    ExamAttemptRepository,
    CourseResultRepository
} from './repositories'

export class DatabaseManager {
    private db: LocalDatabase;

    public classRepo!: ClassRepository;
    public courseAssignmentRepo!: CourseAssignmentRepository;
    public courseRegRepo!: CourseRegistrationRepository;
    public examScheduleRepo!: ExamScheduleRepository;
    public questionRepo!: QuestionRepository;
    public subjectRepo!: SubjectRepository;
    public userRepo!: UserRepository;
    public resultRepo!: ResultRepository;
    public settingRepo!: SettingRepository;
    public examAttemptRepo!: ExamAttemptRepository;
    public courseResultRepo!: CourseResultRepository;

    constructor() {
        this.db = new LocalDatabase();
    }

    public async init() {
        const connection = this.db.getConnection();

        this.classRepo = new ClassRepository(connection);
        this.courseAssignmentRepo = new CourseAssignmentRepository(connection);
        this.courseRegRepo = new CourseRegistrationRepository(connection);
        this.examScheduleRepo = new ExamScheduleRepository(connection);
        this.questionRepo = new QuestionRepository(connection);
        this.subjectRepo = new SubjectRepository(connection);
        this.userRepo = new UserRepository(connection);
        this.resultRepo = new ResultRepository(connection);
        this.settingRepo = new SettingRepository(connection);
        this.examAttemptRepo = new ExamAttemptRepository(connection);
        this.courseResultRepo = new CourseResultRepository(connection);
    }
}
