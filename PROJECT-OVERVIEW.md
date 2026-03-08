Hospital Management System – API Overview

Note: The team is aware that global error handling is necessary and will consider implementing it in future iterations. Current controllers handle errors locally.

Authentication
User Login

Endpoint: POST /api/v1/auth/{actor}/login

Actors: DOCTOR, NURSE, PHARMACY, PATIENT, ADMIN

Description: Authenticate a user and return JWT token.

Request Body:

{
  "email": "string",
  "password": "string"
}

Response: JWT token and user info.

Admin Management
Users

Create User: POST /api/v1/admin/users – Admin only

Get Users: GET /api/v1/admin/users – Admin only, supports pagination and filtering by role

Deactivate User: DELETE /api/v1/admin/users/:userId – Admin only

Departments

Create Department: POST /api/v1/admin/departments – Admin only

Get All Departments: GET /api/v1/admin/departments – Admin only, filter by isActive

Get Department by ID: GET /api/v1/admin/departments/:departmentId – Admin only

Update Department: PUT /api/v1/admin/departments/:departmentId – Admin only

Delete Department: DELETE /api/v1/admin/departments/:departmentId – Admin only

Admissions & Ward Management

Get Available Beds: GET /api/v1/admissions/available-beds – Nurse only, query wardType

Create Ward Admission: POST /api/v1/admissions/admissions/create – Nurse only

Update Patient Vitals: PUT /api/v1/admissions/admissions/:admissionId/vitals – Nurse only

Discharge Patient: PUT /api/v1/admissions/admissions/:admissionId/discharge – Nurse only

Appointments

Create Appointment: POST /api/v1/appointments – Admin, Receptionist, Patient, Doctor

Get Doctor Appointments: GET /api/v1/appointments/doctor/:doctorId – Admin, Receptionist, Doctor

Update Appointment: PUT /api/v1/appointments/:appointmentId – Admin, Receptionist, Doctor

Cancel Appointment: DELETE /api/v1/appointments/:appointmentId – Admin, Receptionist, Doctor

Consultations

Record Consultation: POST /api/v1/consultations – Doctor, Nurse

Get All Consultations: GET /api/v1/consultations – Doctor, Nurse, Pharmacy, Admin

Get Consultation by ID: GET /api/v1/consultations/:id – Doctor, Nurse, Pharmacy, Admin

Update Consultation: PUT /api/v1/consultations/:id – Doctor only

Delete Consultation: DELETE /api/v1/consultations/:id – Admin only

Patient Management

Register Patient: POST /api/v1/patient/register – Admin, Receptionist

Search Patients: GET /api/v1/patient/search – Admin, Receptionist, Doctor, Nurse

Get Patient by ID: GET /api/v1/patient/:id – Admin, Receptionist, Doctor, Nurse

Pharmacy
Prescriptions

Add Prescription: POST /api/v1/pharmacy/prescriptions – Admin, Pharmacy, Doctor

Get Prescription: GET /api/v1/pharmacy/prescriptions/:id – Admin, Pharmacy, Doctor

Update Prescription Payment Status: PUT /api/v1/pharmacy/prescriptions/:id – Admin, Pharmacy, Doctor

Drugs Inventory

Add Drug: POST /api/v1/pharmacy/drugs – Admin, Pharmacy

Update Stock Level: PUT /api/v1/pharmacy/drugs/:drugId/stock – Admin, Pharmacy

Restock Requests

Request Restock: POST /api/v1/pharmacy/restock-requests – Admin, Pharmacy

Notes

All endpoints currently rely on local error handling.

Role-based authorization is enforced using authorizeRoles middleware.

Future improvement: implement global error handling for consistent responses across all modules.

SCENARIO USE CASES BASED ON SRS:

Scenario-Based Flow: Patient Admission and Care

Scenario: A patient visits the hospital, is admitted to a ward, receives treatment, and gets discharged.

Step 1: Patient Registration

Actor: Receptionist or Admin

Receptionist registers a new patient using /patient/register

Required info: Name, DOB, gender, phone, address

The system creates a patient record with a unique patient ID

Step 2: Appointment Scheduling (Optional)

Actor: Receptionist or Patient

Patient may have a pre-scheduled appointment with a doctor

Use /appointments to create an appointment

The system records date, time, doctor, patient, and reason

Step 3: Ward Admission

Actor: Nurse

Nurse checks available beds via /admissions/available-beds

Nurse admits the patient using /admissions/admissions/create

Required info: patient ID, ward ID, doctor ID, bed ID, admission type (EMERGENCY, PLANNED, TRANSFER)

The system assigns the patient to a bed and starts their admission record

Step 4: Recording Vitals

Actor: Nurse

Nurse updates patient vitals during the stay via /admissions/admissions/:admissionId/vitals

Vitals include temperature, blood pressure, heart rate, respiratory rate, oxygen saturation, and notes

Step 5: Consultation

Actor: Doctor or Nurse

Doctor records consultations via /consultations

Required info: patient ID, doctor ID, consultation type, diagnosis, notes

Doctor can update consultations later if needed

Step 6: Prescriptions & Pharmacy

Actor: Doctor & Pharmacy

Doctor inputs prescriptions via /pharmacy/prescriptions

Pharmacy retrieves prescriptions via /pharmacy/prescriptions/:id

Pharmacy updates drug inventory or payment status if needed

Restock requests are made via /pharmacy/restock-requests when stock is low

Step 7: Discharge

Actor: Nurse

Once treatment is complete, nurse discharges the patient via /admissions/admissions/:admissionId/discharge

Required info: discharge summary, discharge date, optional follow-up notes

The system finalizes admission and closes the patient’s bed assignment

Step 8: Admin Oversight

Actor: Admin

Admin can view all users, departments, patients, consultations, and appointments

Admin can deactivate users, manage departments, or delete records if necessary

Provides oversight to ensure all operations follow hospital protocols

Step 9: Optional Reporting / Queries

Actors: Admin, Doctor, Nurse

Search patients: /patient/search

Retrieve appointments for a doctor: /appointments/doctor/:doctorId

Get consultation or patient details by ID: /consultations/:id or /patient/:id

Flow Summary

Receptionist/Admin: Register patient - schedule appointment

Nurse: Admit patient → update vitals - discharge patient

Doctor: Conduct consultations - prescribe medications

Pharmacy: Manage prescriptions and inventory

Admin: Monitor system - manage users & departments