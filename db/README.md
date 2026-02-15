# Hospital Management System - MongoDB Schemas

Complete database schema layer for the Hospital Management System. Includes 14 models, all tested and working.

## Models

- User (system users: doctors, nurses, admin, etc.)
- Department
- Patient (PAT-00001, PAT-00002...)
- Appointment (APT-00001, APT-00002...)
- Consultation
- Ward
- Bed
- Admission (ADM-00001, ADM-00002...)
- VitalSigns
- Drug
- Prescription (PRE-00001, PRE-00002...)
- RestockRequest
- EmergencyCase
- AuditLog

## Getting Started

Install dependencies:
```bash
pnpm install
```

Set up your environment:
```bash
cp .env.example .env
```

Update the `.env` file with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/hospital_db
```

## Usage

Import the models you need:
```javascript
import { Patient, Appointment } from './models/index.js';
```

Creating a patient:
```javascript
const patient = await Patient.create({
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date('1990-05-10'),
  gender: 'MALE',
  phone: '08012345678'
});

console.log(patient.patientId);  // PAT-00001 (generated automatically)
console.log(patient.fullName);   // John Doe (virtual field)
console.log(patient.age);        // 35 (calculated from DOB)
```

## Features

### Automatic ID Generation

Patient IDs, appointment numbers, admission numbers, and prescription numbers are generated automatically:
```javascript
patient.patientId               // PAT-00001, PAT-00002, etc.
appointment.appointmentNumber   // APT-00001, APT-00002, etc.
admission.admissionNumber       // ADM-00001, ADM-00002, etc.
prescription.prescriptionNumber // PRE-00001, PRE-00002, etc.
```

### Virtual Fields

Some fields are computed on-the-fly and not stored in the database:
```javascript
patient.age              // Calculated from dateOfBirth
patient.fullName         // firstName + lastName combined
appointment.isToday      // Checks if appointment is today
prescription.balanceDue  // totalAmount minus amountPaid
vitals.bmi              // Calculated from weight and height
```

### Password Security

User passwords are automatically hashed before saving:
```javascript
const user = await User.create({
  email: 'doctor@hospital.com',
  passwordHash: 'PlainPassword123',  // Gets hashed automatically
  role: 'DOCTOR'
});

// Later, validate a password:
const isValid = await user.comparePassword('PlainPassword123');
```

### Instance Methods

These methods work on individual documents:
```javascript
// Patient
await patient.getMedicalHistory()
await patient.getAppointments()
await patient.getAppointments('COMPLETED')  // Filter by status
await patient.getPrescriptions()
await patient.hasActiveAdmission()

// Appointment
await appointment.cancel(reason, userId)
await appointment.complete()
await appointment.start()
await appointment.markNoShow()

// Prescription
await prescription.markPaid(amount)
await prescription.dispense(userId)

// Admission
await admission.getVitalSigns()
await admission.discharge(summary)

// Drug
await drug.addStock(quantity)
await drug.deductStock(quantity)
```

### Static Methods

These methods work on the model itself:
```javascript
// Searching
await Patient.search('John')
await Patient.findByPatientId('PAT-00001')
await User.findByEmail('jane@hospital.com')
await User.findByRole('DOCTOR')
await User.findDoctorsByDepartment(deptId)

// Inventory
await Drug.getLowStock()
await Drug.getExpired()

// Appointments
await Appointment.getTodayAppointments(doctorId)
await Appointment.getDoctorAppointments(doctorId, date)
await Appointment.getAvailableSlots(doctorId, date)

// Prescriptions
await Prescription.getPending()
await Prescription.getUnpaid()

// Emergency
await EmergencyCase.getActive()
await EmergencyCase.getCritical()
```

## Examples

### Registering a Patient
```javascript
const patient = await Patient.create({
  firstName: 'Alice',
  lastName: 'Johnson',
  dateOfBirth: new Date('1985-03-15'),
  gender: 'FEMALE',
  phone: '08098765432',
  bloodGroup: 'O+',
  allergies: ['Penicillin']
});
```

### Booking an Appointment
```javascript
const appointment = await Appointment.create({
  patientId: patient._id,
  doctorId: doctor._id,
  departmentId: dept._id,
  appointmentDate: new Date('2026-03-01'),
  timeSlot: '14:00',
  type: 'NORMAL',
  reasonForVisit: 'Annual checkup'
});
```

### Recording a Consultation
```javascript
const consultation = await Consultation.create({
  appointmentId: appointment._id,
  patientId: patient._id,
  doctorId: doctor._id,
  diagnosis: 'Hypertension - Stage 1',
  notes: 'Patient reports occasional headaches',
  symptoms: ['Headache', 'Dizziness'],
  outcome: 'PHARMACY'
});
```

### Creating a Prescription
```javascript
const prescription = await Prescription.create({
  patientId: patient._id,
  consultationId: consultation._id,
  items: [{
    drugId: drug._id,
    quantity: 30,
    dosage: '1 tablet daily',
    unitPrice: 200,
    totalPrice: 6000
  }]
});

// Mark as paid
await prescription.markPaid(6000);

// Dispense (this automatically deducts from inventory)
await prescription.dispense(pharmacistId);
```

### Admitting a Patient
```javascript
const admission = await Admission.create({
  patientId: patient._id,
  doctorId: doctor._id,
  wardId: ward._id,
  bedId: bed._id,
  admissionType: 'NORMAL',
  admissionReason: 'Requires monitoring'
});
// The bed status automatically changes to OCCUPIED
```

### Recording Vital Signs
```javascript
const vitals = await VitalSigns.create({
  admissionId: admission._id,
  recordedBy: nurse._id,
  temperature: 37.2,
  bloodPressure: { systolic: 135, diastolic: 85 },
  pulse: 78,
  oxygenSaturation: 98,
  weight: 75,
  height: 175
});

console.log(vitals.bmi);  // Calculated automatically
```

### Discharging a Patient
```javascript
await admission.discharge('Patient recovered. Continue medications at home.');
// The bed status automatically changes back to AVAILABLE
```

## Relationships

You can populate related data like this:
```javascript
const appointment = await Appointment.findById(id)
  .populate('patientId')
  .populate('doctorId')
  .populate('departmentId');

console.log(appointment.patientId.fullName);
console.log(appointment.doctorId.fullName);
console.log(appointment.departmentId.name);
```

## Model Schemas

### User
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  passwordHash: String,
  phone: String,
  role: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'PHARMACY' | 'BILLING' | 'FRONT_DESK',
  departmentId: ObjectId,
  isActive: Boolean
}
```

### Patient
```javascript
{
  patientId: String,  // Auto-generated
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: 'MALE' | 'FEMALE' | 'OTHER',
  phone: String,
  email: String,
  address: String,
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
  allergies: [String],
  emergencyContactName: String,
  emergencyContactPhone: String,
  emergencyContactRelation: String
}
```

### Appointment
```javascript
{
  appointmentNumber: String,  // Auto-generated
  patientId: ObjectId,
  doctorId: ObjectId,
  departmentId: ObjectId,
  appointmentDate: Date,
  timeSlot: String,  // e.g., "09:00"
  type: 'NORMAL' | 'EMERGENCY' | 'FOLLOW_UP',
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
  reasonForVisit: String
}
```

### Prescription
```javascript
{
  prescriptionNumber: String,  // Auto-generated
  patientId: ObjectId,
  consultationId: ObjectId,
  items: [{
    drugId: ObjectId,
    quantity: Number,
    dosage: String,
    unitPrice: Number,
    totalPrice: Number
  }],
  totalAmount: Number,
  amountPaid: Number,
  paymentStatus: 'AWAITING_PAYMENT' | 'PARTIALLY_PAID' | 'PAID',
  status: 'PENDING' | 'DISPENSED' | 'CANCELLED'
}
```

### Admission
```javascript
{
  admissionNumber: String,  // Auto-generated
  patientId: ObjectId,
  doctorId: ObjectId,
  wardId: ObjectId,
  bedId: ObjectId,
  admissionType: 'NORMAL' | 'EMERGENCY' | 'TRANSFER',
  status: 'ACTIVE' | 'DISCHARGED' | 'TRANSFERRED',
  admissionDate: Date,
  dischargeDate: Date,
  dischargeSummary: String
}
```

## Validation

The schemas include validation for:
- Required fields
- Email and phone formats
- Date constraints (e.g., date of birth can't be in the future)
- Enum values
- Numeric ranges
- Business rules (like preventing double-booked appointments)

## Requirements

- Node.js 16 or higher
- MongoDB 4.4 or higher
- npm or pnpm

## Testing

All models have been tested with over 100 test cases covering:
- Data creation and retrieval
- Auto-generated IDs
- Virtual fields
- Instance and static methods
- Validation rules
- Relationships
