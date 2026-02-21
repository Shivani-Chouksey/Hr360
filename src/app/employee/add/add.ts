import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';


@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add.html',
  styleUrls: ['./add.css']  // <-- plural
})
export class Add {
  activeTab: 'personal' | 'professional' | 'documents' | 'account' = 'personal';

  setActiveTabFun(val: 'personal' | 'professional' | 'documents' | 'account') {
    this.activeTab = val;
  }

  isActive(tab: string) {
    return this.activeTab === tab;
  }
  employeeType: 'Contract' | '' = 'Contract';
  avatarPreview = signal<string | null>(null)
  avatarObjectUrl: string | null = null;
  personalDetail = new FormGroup({
    profileImage: new FormControl<File | null>(null),
    firstName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    mobileNumber: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>(' ', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    dob: new FormControl<string>('', { nonNullable: true }),
    maritalStatus: new FormControl<string>('', { nonNullable: true }),
    gender: new FormControl<string>('', { nonNullable: true }),
    nationality: new FormControl<string>('', { nonNullable: true }),
    address: new FormControl<string>('', { nonNullable: true }),
    city: new FormControl<string>('', { nonNullable: true }),
    state: new FormControl<string>('', { nonNullable: true }),
  });

  professionalDetail = new FormGroup({
    employeeID: new FormControl<string>('', { nonNullable: true }),
    userName: new FormControl<string>('', { nonNullable: true }),
    employee_type: new FormControl<string>('', { nonNullable: true }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.email] }),
    department: new FormControl<string>('', { nonNullable: true }),
    designation: new FormControl<string>('', { nonNullable: true }),
    working_days: new FormControl<string>('', { nonNullable: true }),
    joining_date: new FormControl<string>('', { nonNullable: true }),
    office_location: new FormControl<string>('', { nonNullable: true }),
  })


  // --- Account ---
  accountDetail = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.email] }),
    slackId: new FormControl<string>('', { nonNullable: true }),
    skypeId: new FormControl<string>('', { nonNullable: true }),
    githubId: new FormControl<string>('', { nonNullable: true }),
  });

  documentsDetail = new FormGroup({
    appointmentLetter: new FormControl<File | null>(null),
    salarySlip: new FormControl<File | null>(null),
    relievingLetter: new FormControl<File | null>(null),
    experienceLetter: new FormControl<File | null>(null),

  });

  employeeForm = new FormGroup({
    personalDetail: this.personalDetail,
    professionalDetail: this.professionalDetail,
    accountDetail: this.accountDetail,
    documents: this.documentsDetail
  })

  
  AddEmployeeDetail() {
    console.log(this.employeeForm.value);

  }
  

// ✅ Single handler for ALL files (avatar + documents)
onFileChangeFunc(event: Event) {
  const input = event.target as HTMLInputElement;
  const controlName = input.name as
    | 'profileImage'
    | 'appointmentLetter'
    | 'salarySlip'
    | 'relievingLetter'
    | 'experienceLetter';

  const file = input.files && input.files[0] ? input.files[0] : null;

  // If this was the avatar, clean previous ObjectURL if any
  const isAvatar = controlName === 'profileImage';
  if (isAvatar && this.avatarObjectUrl) {
    URL.revokeObjectURL(this.avatarObjectUrl);
    this.avatarObjectUrl = null;
  }

  // Helper to set a control by name across groups
  const setControl = (name: typeof controlName, value: File | null) => {
    if (name === 'profileImage') {
      this.personalDetail.get('profileImage')?.setValue(value);
    } else {
      this.documentsDetail.get(name)?.setValue(value);
    }
  };

  // When no file selected: clear the specific control and reset UI
  if (!file) {
    setControl(controlName, null);

    if (isAvatar) {
      this.avatarPreview.set(null);
    }

    // IMPORTANT: allowed by browser; clears the input
    input.value = '';
    return;
  }

  // Set the right control
  setControl(controlName, file);

  // If avatar, set preview
  if (isAvatar) {
    this.avatarObjectUrl = URL.createObjectURL(file);
    this.avatarPreview.set(this.avatarObjectUrl);
  }

  // (Optional) If you want basic validation for documents, you can
  // run a validateFile(file) here based on controlName and setErrors.



}
// Visual state (optional) to highlight a box on drag over
dragOver = {
  appointmentLetter: false,
  salarySlip: false,
  relievingLetter: false,
  experienceLetter: false,
};

// Prevent default browser behavior (open file in tab)
onDocDragOver(event: DragEvent, name: 'appointmentLetter'|'salarySlip'|'relievingLetter'|'experienceLetter') {
  event.preventDefault();
  this.dragOver[name] = true;
}

onDocDragLeave(event: DragEvent, name: 'appointmentLetter'|'salarySlip'|'relievingLetter'|'experienceLetter') {
  event.preventDefault();
  this.dragOver[name] = false;
}

onDocDrop(event: DragEvent, name: 'appointmentLetter'|'salarySlip'|'relievingLetter'|'experienceLetter') {
  event.preventDefault();
  this.dragOver[name] = false;

  const files = event.dataTransfer?.files;
  if (!files || files.length === 0) return;

  // Reuse your single handler by forging a minimal event with the right input name
  const fakeInput = document.createElement('input');
  fakeInput.type = 'file';
  fakeInput.name = name;
  const dt = new DataTransfer();
  dt.items.add(files[0]);
  fakeInput.files = dt.files;

  const syntheticEvent = { target: fakeInput } as unknown as Event;
  this.onFileChangeFunc(syntheticEvent);
}
}