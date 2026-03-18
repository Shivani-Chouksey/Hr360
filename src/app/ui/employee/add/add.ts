import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { Employee } from '../../../service/employee';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add.html',
  styleUrls: ['./add.css'], // <-- plural
})
export class Add {
  constructor(private employeeService: Employee) {}
  activeTab: 'personal' | 'professional' | 'documents' | 'account' | 'company' = 'personal';
  private _snackBar = inject(MatSnackBar);
  setActiveTabFun(val: 'personal' | 'professional' | 'documents' | 'account' | 'company') {
    this.activeTab = val;
  }

  isActive(tab: string) {
    return this.activeTab === tab;
  }
  employeeType: 'Contract' | '' = 'Contract';
  avatarPreview = signal<string | null>(null);
  avatarObjectUrl: string | null = null;

  personal = new FormGroup({
    // profileImage: new FormControl<File | null>(null),
    firstName: new FormControl<string>('shivani ', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl<string>('chouksey', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phone: new FormControl<string>('13121414142', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    personalEmail: new FormControl<string>('abc@gmail.com', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    dateOfBirth: new FormControl<string>('1998-01-10', { nonNullable: true }),
    maritalStatus: new FormControl<string>('single', { nonNullable: true }),
    gender: new FormControl('female'),
    nationality: new FormControl('Indian'),

    bloodGroup: new FormControl('B+'),

    alternatePhone: new FormControl('9876543211', [Validators.pattern(/^[+]?[0-9]{10,15}$/)]),
    presentAddress: new FormGroup({
      street: new FormControl('mumbai  '),
      city: new FormControl('thane'),
      state: new FormControl('MH'),
      country: new FormControl('India'),
      pincode: new FormControl('321312'),
    }),
    permanentAddress: new FormGroup({
      street: new FormControl('mumbai  '),
      city: new FormControl('thane'),
      state: new FormControl('MH'),
      country: new FormControl('India'),
      pincode: new FormControl('321312'),
    }),
    emergencyContact: new FormGroup({
      name: new FormControl('Raj'),
      relationship: new FormControl('Brother'),
      phone: new FormControl('9876543212', [Validators.pattern(/^[+]?[0-9]{10,15}$/)]),
    }),
  });
  professional = new FormGroup({
    totalExperience: new FormControl<number | null>(2),
    previousCompany: new FormControl<string>('Infosys'),
    previousDesignation: new FormControl<string>('Software Engineer'),

    skills: new FormControl<string>('React,Node,NestJS'),
    highestQualification: new FormControl<string>('B.Tech'),

    university: new FormControl('RGPV'),
    graduationYear: new FormControl(2020),

    certifications: new FormControl('AWS,Azure'),

    salary: new FormGroup({
      ctc: new FormControl(800000),

      basic: new FormControl(320000),

      hra: new FormControl(160000),

      specialAllowance: new FormControl(320000),

      bankName: new FormControl('HDFC'),

      accountNumber: new FormControl('1234567890'),

      ifscCode: new FormControl('HDFC0001234'),

      panNumber: new FormControl('ABCDE1234F', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]),
    }),
  });

  company = new FormGroup({
    employeeId: new FormControl<string>('Emply001'),
    companyEmail: new FormControl<string>('shivani@company.com'),
    department: new FormControl<string>('Engineering'),
    designation: new FormControl<string>('Full Stack Developer'),
    reportingManager: new FormControl<string>('Rahul Sharma'),
    location: new FormControl<string>('Mumbai'),

    dateOfJoining: new FormControl<string>('2026-03-12'),
    employmentType: new FormControl<string>('full-time'),

    isProbation: new FormControl<boolean>(false),
    probationEndDate: new FormControl<string>('2026-03-12'),

    workShift: new FormControl<string>('Morning'),
    workLocation: new FormControl<string>('office'),
  });

  documentsDetail = new FormGroup({
    appointmentLetter: new FormControl<File | null>(null),
    salarySlip: new FormControl<File | null>(null),
    relievingLetter: new FormControl<File | null>(null),
    experienceLetter: new FormControl<File | null>(null),
  });

  employeeForm = new FormGroup({
    personal: this.personal,
    company: this.company,
    professional: this.professional,
    password: new FormControl('Test@1234', [Validators.minLength(8)]),
    role: new FormControl('admin'),
  });

  success: boolean = false;
  error: string = '';

  preparePayload() {
    const payload: any = this.employeeForm.value;

    payload.company.dateOfJoining = new Date(payload.company.dateOfJoining);

    payload.company.probationEndDate = new Date(payload.company.probationEndDate);

    payload.professional.skills = payload.professional.skills
      .split(',')
      .map((s: string) => s.trim());

    payload.professional.certifications = payload.professional.certifications
      .split(',')
      .map((s: string) => s.trim());

    payload.professional.salary.ctc = Number(payload.professional.salary.ctc);

    payload.professional.salary.basic = Number(payload.professional.salary.basic);

    payload.professional.salary.hra = Number(payload.professional.salary.hra);

    payload.professional.salary.specialAllowance = Number(
      payload.professional.salary.specialAllowance,
    );

    return payload;
  }

  // AddEmployeeDetail() {
  //   const payload = this.preparePayload();

  //   const formData = new FormData();

  //   formData.append('data', JSON.stringify(payload));

  //   Object.entries(this.documentsDetail.value).forEach(([key, file]) => {
  //     if (file) {
  //       formData.append(key, file);
  //     }
  //   });

  //   const profileImage = this.personal.get('profileImage')?.value;
  //   if (profileImage) {
  //     formData.append('profileImage', profileImage);
  //   }

  //   this.employeeService.AddEmployee(formData).subscribe({
  //     next: () => {
  //       this._snackBar.open('Employee Created Successfully', 'OK');
  //     },

  //     error: (err) => {
  //       this._snackBar.open(err?.error?.message || 'Error', 'Close');
  //     },
  //   });
  // }

  onFileChangeFunc(event: Event) {
    const input = event.target as HTMLInputElement;

    const name = input.name as
      | 'profileImage'
      | 'appointmentLetter'
      | 'salarySlip'
      | 'relievingLetter'
      | 'experienceLetter';

    const file = input.files?.[0] || null;

    if (name === 'profileImage') {
      // this.personal.get('profileImage')?.setValue(file);

      if (file) {
        this.avatarObjectUrl = URL.createObjectURL(file);
        this.avatarPreview.set(this.avatarObjectUrl);
      }
    } else {
      this.documentsDetail.get(name)?.setValue(file);
    }
  }

  AddEmployeeDetail() {
    console.log(this.employeeForm.value);
    const payload: any = this.employeeForm.value;
    payload.professional.skills = payload.professional.skills
      .split(',')
      .map((s: string) => s.trim());
    // payload.personal.profileImage = 'htpps://image.png';
    payload.professional.certifications = payload.professional.certifications
      .split(',')
      .map((s: string) => s.trim());

    this.employeeService.AddEmployee(payload).subscribe({
      next: (EMP: any) => (this.success = true),
      error: (err: { status: number; message: string }) =>
        (this.error = err.message || 'Failed to Add Employee'),
    });
    console.log('error', this.error);
    if (this.error) {
      this.openSnackBar(this.error, 'Dance');
    }
    if (this.success) {
      this.openSnackBar('Employee Created Successfully', 'Dance');
    }
  }

  // ✅ Single handler for ALL files (avatar + documents)
  // onFileChangeFunc(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   const controlName = input.name as
  //     | 'profileImage'
  //     | 'appointmentLetter'
  //     | 'salarySlip'
  //     | 'relievingLetter'
  //     | 'experienceLetter';

  //   const file = input.files && input.files[0] ? input.files[0] : null;

  //   // If this was the avatar, clean previous ObjectURL if any
  //   const isAvatar = controlName === 'profileImage';
  //   if (isAvatar && this.avatarObjectUrl) {
  //     URL.revokeObjectURL(this.avatarObjectUrl);
  //     this.avatarObjectUrl = null;
  //   }

  //   // Helper to set a control by name across groups
  //   const setControl = (name: typeof controlName, value: File | null) => {
  //     if (name === 'profileImage') {
  //       this.personal.get('profileImage')?.setValue(value);
  //     } else {
  //       this.documentsDetail.get(name)?.setValue(value);
  //     }
  //   };

  //   // When no file selected: clear the specific control and reset UI
  //   if (!file) {
  //     setControl(controlName, null);

  //     if (isAvatar) {
  //       this.avatarPreview.set(null);
  //     }

  //     // IMPORTANT: allowed by browser; clears the input
  //     input.value = '';
  //     return;
  //   }

  //   // Set the right control
  //   setControl(controlName, file);

  //   // If avatar, set preview
  //   if (isAvatar) {
  //     this.avatarObjectUrl = URL.createObjectURL(file);
  //     this.avatarPreview.set(this.avatarObjectUrl);
  //   }

  //   // (Optional) If you want basic validation for documents, you can
  //   // run a validateFile(file) here based on controlName and setErrors.
  // }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
