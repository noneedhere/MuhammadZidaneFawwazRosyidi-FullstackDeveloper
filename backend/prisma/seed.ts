import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.applicationHistory.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const seeker1 = await prisma.user.create({
    data: {
      email: 'seeker1@example.com',
      password: hashedPassword,
      fullName: 'Budi Santoso',
      role: 'JOB_SEEKER',
      phone: '081234567890',
      bio: 'Experienced frontend developer with 3 years of experience in React and TypeScript.',
    },
  });

  const seeker2 = await prisma.user.create({
    data: {
      email: 'seeker2@example.com',
      password: hashedPassword,
      fullName: 'Siti Rahayu',
      role: 'JOB_SEEKER',
      phone: '081234567891',
      bio: 'Fresh graduate in Computer Science looking for UI/UX design opportunities.',
    },
  });

  const company1 = await prisma.user.create({
    data: {
      email: 'company1@example.com',
      password: hashedPassword,
      fullName: 'Admin TechCorp',
      role: 'COMPANY',
      companyName: 'TechCorp Indonesia',
      description: 'Leading technology company in Indonesia specializing in enterprise software solutions.',
      location: 'Jakarta Selatan',
      website: 'https://techcorp.co.id',
    },
  });

  const company2 = await prisma.user.create({
    data: {
      email: 'company2@example.com',
      password: hashedPassword,
      fullName: 'Admin Digital Nusantara',
      role: 'COMPANY',
      companyName: 'Digital Nusantara',
      description: 'Digital agency focused on mobile development and data analytics.',
      location: 'Bandung',
      website: 'https://digitalnusantara.id',
    },
  });

  // Create jobs
  const job1 = await prisma.job.create({
    data: {
      title: 'Frontend Developer',
      description: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building and maintaining user-facing features using React.js and TypeScript.\n\nResponsibilities:\n- Develop new user-facing features\n- Build reusable components\n- Optimize applications for performance\n- Collaborate with backend developers',
      requirements: 'Requirements:\n- 2+ years of experience with React.js\n- Proficiency in TypeScript\n- Experience with Tailwind CSS\n- Understanding of RESTful APIs\n- Good communication skills\n- BS in Computer Science or equivalent',
      location: 'Jakarta Selatan',
      salaryMin: 8000000,
      salaryMax: 15000000,
      type: 'FULL_TIME',
      status: 'OPEN',
      companyId: company1.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: 'Backend Engineer',
      description: 'Join our backend team to build scalable APIs and microservices using Node.js and PostgreSQL.\n\nResponsibilities:\n- Design and implement RESTful APIs\n- Write clean, maintainable code\n- Manage database migrations\n- Implement security best practices',
      requirements: 'Requirements:\n- 3+ years of Node.js experience\n- Proficiency in TypeScript\n- Experience with PostgreSQL and Prisma/Sequelize\n- Understanding of API design patterns\n- Experience with Docker is a plus',
      location: 'Jakarta Pusat',
      salaryMin: 10000000,
      salaryMax: 18000000,
      type: 'FULL_TIME',
      status: 'OPEN',
      companyId: company1.id,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: 'UI/UX Design Intern',
      description: 'We are looking for a creative UI/UX Design Intern to join our design team for a 6-month internship program.\n\nWhat you will learn:\n- User research methodologies\n- Wireframing and prototyping\n- Design systems\n- Usability testing',
      requirements: 'Requirements:\n- Currently pursuing a degree in Design or related field\n- Proficiency in Figma\n- Understanding of design principles\n- Strong attention to detail\n- Portfolio showcasing design work',
      location: 'Jakarta Selatan',
      salaryMin: 2000000,
      salaryMax: 4000000,
      type: 'INTERNSHIP',
      status: 'OPEN',
      companyId: company1.id,
    },
  });

  const job4 = await prisma.job.create({
    data: {
      title: 'Mobile Developer',
      description: 'We need a Mobile Developer to build cross-platform mobile applications using React Native.\n\nResponsibilities:\n- Develop mobile apps for iOS and Android\n- Integrate with backend APIs\n- Optimize performance\n- Write unit tests',
      requirements: 'Requirements:\n- 2+ years of React Native experience\n- Experience with TypeScript\n- Published apps on App Store/Play Store\n- Understanding of mobile UI patterns\n- Experience with state management (Redux/MobX)',
      location: 'Bandung',
      salaryMin: 12000000,
      salaryMax: 20000000,
      type: 'CONTRACT',
      status: 'OPEN',
      companyId: company2.id,
    },
  });

  const job5 = await prisma.job.create({
    data: {
      title: 'Data Analyst',
      description: 'Part-time Data Analyst position to help analyze business metrics and user behavior data.\n\nResponsibilities:\n- Analyze large datasets\n- Create dashboards and reports\n- Present findings to stakeholders\n- Identify trends and patterns',
      requirements: 'Requirements:\n- Experience with SQL\n- Proficiency in Python or R\n- Knowledge of data visualization tools\n- Strong analytical thinking\n- Experience with Excel/Google Sheets',
      location: 'Remote',
      salaryMin: 6000000,
      salaryMax: 10000000,
      type: 'PART_TIME',
      status: 'CLOSED',
      companyId: company2.id,
    },
  });

  // Create applications with history
  // App 1: Budi -> Frontend Developer (REVIEWING)
  const app1 = await prisma.application.create({
    data: {
      userId: seeker1.id,
      jobId: job1.id,
      currentStatus: 'REVIEWING',
    },
  });
  await prisma.applicationHistory.createMany({
    data: [
      { applicationId: app1.id, previousStatus: null, newStatus: 'APPLIED', changedBy: seeker1.id, changedAt: new Date('2026-09-15T10:30:00Z') },
      { applicationId: app1.id, previousStatus: 'APPLIED', newStatus: 'REVIEWING', changedBy: company1.id, changedAt: new Date('2026-09-16T14:00:00Z') },
    ],
  });

  // App 2: Budi -> Backend Engineer (APPLIED)
  const app2 = await prisma.application.create({
    data: {
      userId: seeker1.id,
      jobId: job2.id,
      currentStatus: 'APPLIED',
    },
  });
  await prisma.applicationHistory.create({
    data: { applicationId: app2.id, previousStatus: null, newStatus: 'APPLIED', changedBy: seeker1.id, changedAt: new Date('2026-09-17T09:00:00Z') },
  });

  // App 3: Budi -> Mobile Developer (SHORTLISTED)
  const app3 = await prisma.application.create({
    data: {
      userId: seeker1.id,
      jobId: job4.id,
      currentStatus: 'SHORTLISTED',
    },
  });
  await prisma.applicationHistory.createMany({
    data: [
      { applicationId: app3.id, previousStatus: null, newStatus: 'APPLIED', changedBy: seeker1.id, changedAt: new Date('2026-09-14T08:00:00Z') },
      { applicationId: app3.id, previousStatus: 'APPLIED', newStatus: 'REVIEWING', changedBy: company2.id, changedAt: new Date('2026-09-15T11:00:00Z') },
      { applicationId: app3.id, previousStatus: 'REVIEWING', newStatus: 'SHORTLISTED', changedBy: company2.id, changedAt: new Date('2026-09-18T09:15:00Z') },
    ],
  });

  // App 4: Siti -> Frontend Developer (ACCEPTED)
  const app4 = await prisma.application.create({
    data: {
      userId: seeker2.id,
      jobId: job1.id,
      currentStatus: 'ACCEPTED',
    },
  });
  await prisma.applicationHistory.createMany({
    data: [
      { applicationId: app4.id, previousStatus: null, newStatus: 'APPLIED', changedBy: seeker2.id, changedAt: new Date('2026-09-13T10:00:00Z') },
      { applicationId: app4.id, previousStatus: 'APPLIED', newStatus: 'REVIEWING', changedBy: company1.id, changedAt: new Date('2026-09-14T14:00:00Z') },
      { applicationId: app4.id, previousStatus: 'REVIEWING', newStatus: 'SHORTLISTED', changedBy: company1.id, changedAt: new Date('2026-09-16T09:00:00Z') },
      { applicationId: app4.id, previousStatus: 'SHORTLISTED', newStatus: 'ACCEPTED', changedBy: company1.id, changedAt: new Date('2026-09-20T11:00:00Z') },
    ],
  });

  // App 5: Siti -> UI/UX Design Intern (REJECTED)
  const app5 = await prisma.application.create({
    data: {
      userId: seeker2.id,
      jobId: job3.id,
      currentStatus: 'REJECTED',
    },
  });
  await prisma.applicationHistory.createMany({
    data: [
      { applicationId: app5.id, previousStatus: null, newStatus: 'APPLIED', changedBy: seeker2.id, changedAt: new Date('2026-09-14T12:00:00Z') },
      { applicationId: app5.id, previousStatus: 'APPLIED', newStatus: 'REVIEWING', changedBy: company1.id, changedAt: new Date('2026-09-15T15:00:00Z') },
      { applicationId: app5.id, previousStatus: 'REVIEWING', newStatus: 'REJECTED', changedBy: company1.id, changedAt: new Date('2026-09-17T10:00:00Z') },
    ],
  });

  console.log('✅ Seed data created successfully!');
  console.log('📧 Demo accounts:');
  console.log('   Job Seekers: seeker1@example.com / seeker2@example.com (password: password123)');
  console.log('   Companies: company1@example.com / company2@example.com (password: password123)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
