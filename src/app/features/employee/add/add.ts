import { Component, inject, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../services/employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatSelect, MatOption, MatSelectModule } from "@angular/material/select";
import { FormInput } from "../shared/form-input/form-input";
import { required } from '@angular/forms/signals';

type TabKey = | 'personal' | 'company' | 'professional' | 'documents' | 'account';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption,
    MatFormFieldModule,
    MatSelectModule, FormInput],
  templateUrl: './add.html',
  styleUrls: ['./add.css'], // <-- plural
})


export class Add implements OnInit {
  constructor(private employeeService: Employee) { }

  employeeTabs: { key: TabKey, label: string }[] = [
    { key: 'personal', label: ' Personal Information' },
    { key: 'professional', label: '  Professional Information' },
    { key: 'company', label: ' Company' },
    { key: 'documents', label: 'Documents' },
    { key: 'account', label: 'Account Access' }
  ]
  maritalStatusOptions = [
    { label: 'Single', value: 'single' },
    { label: 'Engaged', value: 'engaged' },
    { label: 'Married', value: 'married' },

  ];
  genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];
  nationalityOptions = [
  { label: 'India', value: 'india' },
  { label: 'Other', value: 'other' }
];
departmentOptions = [
  { label: 'Human Resources', value: 'hr' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Sales', value: 'sales' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Finance', value: 'finance' },
  { label: 'Operations', value: 'operations' },
  { label: 'Information Technology', value: 'it' },
  { label: 'Customer Support', value: 'customer_support' },
  { label: 'Product Management', value: 'product' },
  { label: 'Quality Assurance', value: 'qa' },
  { label: 'Administration', value: 'administration' },
  { label: 'Legal', value: 'legal' },
  { label: 'Procurement', value: 'procurement' },
  { label: 'Training & Development', value: 'training' },
];
employmentTypeOptions = [
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Intern', value: 'intern' },
  { label: 'Freelancer', value: 'freelancer' },
  { label: 'Temporary', value: 'temporary' },
  { label: 'Consultant', value: 'consultant' },
  { label: 'Probation', value: 'probation' },
];

workShiftOptions = [
  { label: 'Morning Shift', value: 'morning' },
  { label: 'General / Day Shift', value: 'general' },
  { label: 'Evening Shift', value: 'evening' },
  { label: 'Night Shift', value: 'night' },
  { label: 'Rotational Shift', value: 'rotational' },
  { label: 'Flexible Shift', value: 'flexible' },
  { label: 'Split Shift', value: 'split' },
];

workLocationOptions = [
  { label: 'Office', value: 'office' },
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'Client Location', value: 'client_location' },
  { label: 'Onsite', value: 'onsite' },
];
employeeRoleOptions = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'HR Manager', value: 'hr_manager' },
  { label: 'HR Executive', value: 'hr_executive' },
  { label: 'Manager', value: 'manager' },
  { label: 'Team Lead', value: 'team_lead' },
  { label: 'Employee', value: 'employee' },
  { label: 'Intern', value: 'intern' },
  { label: 'Contractor', value: 'contractor' },
];

  activeTab: 'personal' | 'professional' | 'documents' | 'account' | 'company' = 'personal';
  employeeType: 'Contract' | '' = 'Contract';
  avatarPreview = signal<string | null>(null);
  avatarObjectUrl: string | null = null;
  reportingManagerOptions: { label: string, value: any }[] = [];
  private _snackBar = inject(MatSnackBar);

  setActiveTabFun(val: 'personal' | 'professional' | 'documents' | 'account' | 'company') {
    this.activeTab = val;
  }

  isActive(tab: string) {
    return this.activeTab === tab;
  }

  personal = new FormGroup({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phone: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    personalEmail: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    dateOfBirth: new FormControl<string>('', { nonNullable: true }),
    maritalStatus: new FormControl<string>('', { nonNullable: true }),
    gender: new FormControl(''),
    nationality: new FormControl(''),

    bloodGroup: new FormControl(''),

    alternatePhone: new FormControl('', [Validators.pattern(/^[+]?[0-9]{10,15}$/)]),
    presentAddress: new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      pincode: new FormControl(''),
    }),
    permanentAddress: new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      pincode: new FormControl(''),
    }),
    emergencyContact: new FormGroup({
      name: new FormControl(''),
      relationship: new FormControl(''),
      phone: new FormControl(''),
    }),
  });

  professional = new FormGroup({
    totalExperience: new FormControl<number | null>(0, { nonNullable: true, validators: [Validators.required], }),
    previousCompany: new FormControl<string>('', { nonNullable: true, validators: [Validators.required], }),
    previousDesignation: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    skills: new FormControl<string>('React,Node,NestJS'),
    highestQualification: new FormControl<string>('B.Tech'),
    university: new FormControl('RGPV'),
    graduationYear: new FormControl(2020),
    certifications: new FormControl(),
    salary: new FormGroup({
      ctc: new FormControl<number>(0, { validators: [Validators.required] }),
      basic: new FormControl(0, { validators: [Validators.required] }),
      hra: new FormControl(0, { validators: [Validators.required] }),
      specialAllowance: new FormControl(0, { validators: [Validators.required] }),
      bankName: new FormControl('', { validators: [Validators.required, Validators.nullValidator] }),
      accountNumber: new FormControl(0, { validators: [Validators.required] }),
      ifscCode: new FormControl('', { validators: [Validators.required, Validators.nullValidator] }),
      panNumber: new FormControl('', [ Validators.required]),
      // panNumber: new FormControl('', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/), Validators.required]),
    }),
  });

  company = new FormGroup({
    employeeId: new FormControl<string>('', { nonNullable:true,validators:Validators.required}),
    companyEmail: new FormControl<string>('', { nonNullable:true,validators: [Validators.required,Validators.email] }),
    department: new FormControl<string>('', { nonNullable:true,validators: [Validators.required] }),
    designation: new FormControl<string>('', { nonNullable:true,validators: [Validators.required] }),
    // reportingManager: new FormControl<string>('', { nonNullable:true,validators: [Validators.required] }),
    location: new FormControl<string>('', { nonNullable:true,validators: [Validators.required] }),
    dateOfJoining: new FormControl<string>('2026-03-12', {nonNullable:true, validators: [Validators.required] }),
    employmentType: new FormControl<string>('', { nonNullable:true,validators: [Validators.required] }),
    isProbation: new FormControl<boolean>(false),
    probationEndDate: new FormControl<string>('2026-03-12', { nonNullable:true,validators: [Validators.required] }),
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
    password: new FormControl('',{validators:[Validators.required]}),
    // password: new FormControl('',{ validators:[Validators.minLength(8), Validators.required]}),
    role: new FormControl('',{validators:Validators.required}),
  });

  success: boolean = false;
  error: string = '';
  reportingManagerList: any
  ngOnInit(): void {
    this.employeeService.GetEmployeeListByRole('manager').subscribe({
      next: (res) => {
        this.reportingManagerList = res
        
 this.reportingManagerOptions = res.map((emp:any) => ({
      label: `${emp.personal.firstName} ${emp.personal.lastName}`,
      value: emp._id
    }));

      },
      error: (err) => {
        console.log(err);
      }
    });

  this.employeeForm.statusChanges.subscribe(status => {
    console.log('Form status:', status);
    console.log('Form valid:', this.employeeForm.valid);
    
 const left = this.getInvalidControlNames(this.employeeForm);
  console.log(`${left} fields still invalid`)
  });
  }


getInvalidControlNames(
  form: FormGroup,
  parentKey: string = ''
): string[] {

  let invalidControls: string[] = [];

  Object.keys(form.controls).forEach(key => {
    const control: AbstractControl = form.controls[key];
    const controlPath = parentKey ? `${parentKey}.${key}` : key;

    if (control instanceof FormGroup) {
      // recurse for nested groups
      invalidControls.push(
        ...this.getInvalidControlNames(control, controlPath)
      );
    } else if (control.invalid) {
      invalidControls.push(controlPath);
    }
  });

  return invalidControls;
}

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
    console.log("AddEmployeeDetail-------------->",this.employeeForm.value);
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

  getTabErrors(tabKey: string): number {
    const group = this.employeeForm.get(tabKey) as FormGroup;
    if (!group) return 0;

    let count = 0;

    const countErrors = (fg: FormGroup | FormArray) => {
      Object.values(fg.controls).forEach(ctrl => {
        if (ctrl instanceof FormGroup) {
          countErrors(ctrl);
        } else if (ctrl.invalid) {
          count++;
        }
      });
    };

    countErrors(group);
    return count;
  }

}
