// Test script to verify enquiry service functionality
// This can be used for debugging purposes

import { EnquiryService } from './modules/admin/enquiry-manager/services/enquiry.service';

export function testEnquiryService() {
  console.log('🧪 Testing EnquiryService...');
  
  const service = new EnquiryService();
  
  // Test getting all enquiries
  console.log('🧪 Testing getAll()...');
  service.getAll().subscribe(enquiries => {
    console.log('🧪 Initial enquiries:', enquiries);
    
    // Test adding a new enquiry
    console.log('🧪 Testing add()...');
    const testEnquiry = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '123-456-7890',
      company: 'Test Company',
      subject: 'Test Subject',
      service: 'Test Service',
      message: 'This is a test message'
    };
    
    service.add(testEnquiry).subscribe(newEnquiry => {
      console.log('🧪 Added enquiry:', newEnquiry);
      
      // Test getting all enquiries again
      service.getAll().subscribe(updatedEnquiries => {
        console.log('🧪 Updated enquiries:', updatedEnquiries);
        console.log('🧪 Test completed successfully!');
      });
    });
  });
}
