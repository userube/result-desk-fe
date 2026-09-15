# Ewune MVP QA

## E2E Demo Flow

1. Sign up a school and confirm it lands on `/app/setup`.
2. Invite a teacher from `/app/teachers`, open the invite link, accept it, and log in.
3. Assign the teacher to a class and subject.
4. Create a student from `/app/students`, edit the record, move the student to another class, and open the student history page.
5. Import a CSV with columns: firstName,lastName,admissionNumber,gender,parentName,parentPhone,parentEmail,className.
6. Submit a weekly report from `/app/weekly-reports`.
7. Enter CA and exam scores from `/app/results`, save, then submit.
8. Request result approval, approve the batch, generate the class PDF, and download the generated PDF.
9. Save grading settings, result template settings, and domain settings. Run domain verification.

## Mobile QA Widths

- 360px: login, dashboard, students, weekly reports, score entry.
- 768px: dashboard, teachers, students, results.
- Desktop: landing page, dashboard, settings, results PDF flow.

## Required Production Env Vars

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL`
- `APP_BASE_URL`
- `EMAIL_PROVIDER`
- `RESEND_API_KEY` or `BREVO_API_KEY`
- `EMAIL_FROM`
