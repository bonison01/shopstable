
export interface CompanyAccess {
  id: string;
  business_name: string;
  owner_id: string;
  staff_id: string;
  created_at: string;
}

export interface StaffMember {
  id: string;
  staff_email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  created_at: string;
  user_id: string;
  company_access?: CompanyAccess[];
}

export interface EditableStaffData {
  id: string;
  staff_email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}
