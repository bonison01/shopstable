
export interface StaffMember {
  id: string;
  staff_email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  created_at?: string;
  user_id?: string;
}

export interface EditableStaffData {
  id: string;
  staff_email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}
