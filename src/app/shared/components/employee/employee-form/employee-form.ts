import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../../../features/employee/services/employee';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm implements OnInit {
  // activeTab: 'personal' | 'professional' | 'documents' | 'account' | 'company' = 'personal';
  activeModule: 'profile' | 'attendance' | 'projects' | 'leave' = 'profile';
  private originalEmployee!: any;
  @Input() employeeDetails!: any;
  @Input() activeTab: 'personal' | 'professional' | 'documents' | 'account' | 'company' = 'personal';
  @Output() saveChanges = new EventEmitter<any>();


  ngOnInit(): void {
    console.log("employeeDetails inside employee form", this.employeeDetails);

    if (this.employeeDetails) {
      this.mapEmployeeToForm(this.employeeDetails)
    }
  }


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

  setActiveTabFun(val: 'personal' | 'professional' | 'documents' | 'account' | 'company') {
    this.activeTab = val;
  }

  private mapEmployeeToForm(employee: any): void {
    console.log("employee inside mapEmployeeToForm", employee);
    this.originalEmployee = structuredClone(employee);
    this.employeeForm.patchValue({
      personal: {
        firstName: employee.personal.firstName,
        lastName: employee.personal.lastName,
        phone: employee.personal.phone,
        alternatePhone: employee.personal.alternatePhone,
        personalEmail: employee.personal.personalEmail,
        dateOfBirth: employee.personal.dateOfBirth,
        maritalStatus: employee.personal.maritalStatus,
        gender: employee.personal.gender,
        nationality: employee.personal.nationality,
        bloodGroup: employee.personal.bloodGroup,

        presentAddress: { ...employee.personal.presentAddress },
        permanentAddress: { ...employee.personal.permanentAddress },
        emergencyContact: { ...employee.personal.emergencyContact }
      },

      company: {
        employeeId: employee.company.employeeId,
        companyEmail: employee.company.companyEmail,
        department: employee.company.department,
        designation: employee.company.designation,
        reportingManager: employee.company.reportingManager,
        location: employee.company.location,
        dateOfJoining: employee.company.dateOfJoining,
        employmentType: employee.company.employmentType,
        isProbation: employee.company.isProbation,
        probationEndDate: employee.company.probationEndDate,
        workShift: employee.company.workShift,
        workLocation: employee.company.workLocation
      },

      professional: {
        totalExperience: employee.professional.totalExperience,
        previousCompany: employee.professional.previousCompany,
        previousDesignation: employee.professional.previousDesignation,
        skills: employee.professional.skills.join(', '),
        highestQualification: employee.professional.highestQualification,
        university: employee.professional.university,
        graduationYear: employee.professional.graduationYear,
        certifications: employee.professional.certifications.join(', '),

        salary: {
          ctc: employee.professional.salary.ctc,
          basic: employee.professional.salary.basic,
          hra: employee.professional.salary.hra,
          specialAllowance: employee.professional.salary.specialAllowance,
          bankName: employee.professional.salary.bankName,
          accountNumber: employee.professional.salary.accountNumber,
          ifscCode: employee.professional.salary.ifscCode,
          panNumber: employee.professional.salary.panNumber
        }
      },

      role: employee.role
    });
    this.employeeForm.markAsPristine();  // reset dirty state
    // Security best practice
    this.employeeForm.get('password')?.disable();
  }
  UpdateEmployeeDetails() {

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const changedPayload = this.extractDirtyValues(this.employeeForm, this.originalEmployee)
    console.log("changedPayload", changedPayload);
    if (!Object.keys(changedPayload).length) return;
    this.saveChanges.emit(changedPayload);
  }

  private extractDirtyValues(
    form: FormGroup,
    original: any
  ): any {
    const dirtyValues: any = {};

    Object.keys(form.controls).forEach(key => {
      const control: any = form.get(key);

      if (!control) return;

      // Nested FormGroup
      if (control instanceof FormGroup) {
        const nestedDirty = this.extractDirtyValues(
          control,
          original?.[key]
        );

        if (Object.keys(nestedDirty).length) {
          dirtyValues[key] = nestedDirty;
        }
      }
      // Simple control
      else if (control.dirty) {
        dirtyValues[key] = control.value;
      }
    });

    return dirtyValues;
  }
}
