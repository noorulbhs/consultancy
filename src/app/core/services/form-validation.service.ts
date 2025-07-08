import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  constructor(private notificationService: NotificationService) {}

  async validateForm(form: FormGroup, fieldDisplayNames: { [key: string]: string } = {}): Promise<boolean> {
    // Show loading notification with spinner
    const loadingNotificationId = this.notificationService.info('🔄 Validating...', 'Please wait while we validate your form data.');
    
    // Add a realistic delay to show validation is processing
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Clear the loading notification
    this.notificationService.dismiss(loadingNotificationId);
    
    this.markAllFieldsAsTouched(form);
    
    if (form.valid) {
      this.notificationService.success('✅ Validation Passed', 'All form fields are valid and ready for submission!');
      return true;
    } else {
      this.showValidationReport(form, fieldDisplayNames);
      return false;
    }
  }

  validateFormSync(form: FormGroup, fieldDisplayNames: { [key: string]: string } = {}): boolean {
    this.markAllFieldsAsTouched(form);
    
    if (form.valid) {
      this.notificationService.success('Validation Passed', 'All form fields are valid and ready for submission!');
      return true;
    } else {
      this.showValidationReport(form, fieldDisplayNames);
      return false;
    }
  }

  private markAllFieldsAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control) {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      }
    });
  }

  private showValidationReport(form: FormGroup, fieldDisplayNames: { [key: string]: string }) {
    const errors: string[] = [];
    
    this.collectErrors(form, errors, fieldDisplayNames);

    if (errors.length > 0) {
      const errorMessage = `Please fix the following issues:\n• ${errors.join('\n• ')}`;
      this.notificationService.error('Validation Failed', errorMessage);
    }
  }

  private collectErrors(
    form: FormGroup | AbstractControl, 
    errors: string[], 
    fieldDisplayNames: { [key: string]: string },
    parentPath: string = ''
  ) {
    if (form instanceof FormGroup) {
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        const fullPath = parentPath ? `${parentPath}.${key}` : key;
        
        if (control instanceof FormGroup) {
          this.collectErrors(control, errors, fieldDisplayNames, fullPath);
        } else if (control && control.invalid && control.errors) {
          const displayName = fieldDisplayNames[fullPath] || this.formatFieldName(key);
          
          if (control.errors['required']) {
            errors.push(`${displayName} is required`);
          } else if (control.errors['email']) {
            errors.push(`${displayName} must be a valid email address`);
          } else if (control.errors['minlength']) {
            const requiredLength = control.errors['minlength'].requiredLength;
            errors.push(`${displayName} must be at least ${requiredLength} characters long`);
          } else if (control.errors['maxlength']) {
            const requiredLength = control.errors['maxlength'].requiredLength;
            errors.push(`${displayName} must not exceed ${requiredLength} characters`);
          } else if (control.errors['min']) {
            const minValue = control.errors['min'].min;
            errors.push(`${displayName} must be at least ${minValue}`);
          } else if (control.errors['max']) {
            const maxValue = control.errors['max'].max;
            errors.push(`${displayName} must not exceed ${maxValue}`);
          } else if (control.errors['pattern']) {
            errors.push(`${displayName} has an invalid format`);
          } else {
            errors.push(`${displayName} is invalid`);
          }
        }
      });
    }
  }

  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  // Helper method to check if a field should show error styling
  hasFieldError(form: FormGroup, fieldName: string, showValidationErrors: boolean): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.touched || showValidationErrors));
  }

  // Helper method to get field error message
  getFieldError(form: FormGroup, fieldName: string, showValidationErrors: boolean, fieldDisplayNames: { [key: string]: string } = {}): string {
    const field = form.get(fieldName);
    if (field && field.errors && (field.touched || showValidationErrors)) {
      const displayName = fieldDisplayNames[fieldName] || this.formatFieldName(fieldName);
      
      if (field.errors['required']) {
        return `${displayName} is required`;
      } else if (field.errors['email']) {
        return `${displayName} must be a valid email address`;
      } else if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${displayName} must be at least ${requiredLength} characters long`;
      } else if (field.errors['maxlength']) {
        const requiredLength = field.errors['maxlength'].requiredLength;
        return `${displayName} must not exceed ${requiredLength} characters`;
      } else if (field.errors['min']) {
        const minValue = field.errors['min'].min;
        return `${displayName} must be at least ${minValue}`;
      } else if (field.errors['max']) {
        const maxValue = field.errors['max'].max;
        return `${displayName} must not exceed ${maxValue}`;
      } else if (field.errors['pattern']) {
        return `${displayName} has an invalid format`;
      }
    }
    return '';
  }
}
